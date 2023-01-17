let currentUrl = '/rasp?groupId=531873998';
let currentWeek;

fetch('/groupsAndTeachers')
    .then((data) => data.json())
    .then((res) => {
        let selectElement = document.querySelector("#select-group");
        for (let group of res.groups) {
            let groupElement = document.createElement("GroupsAndTeachers");
            groupElement.innerHTML = group.name;
            groupElement.setAttribute("value", group.link);
            selectElement.appendChild(groupElement);
        }
        selectElement.addEventListener("change", () => {
            updateData(selectElement.value);
            document.querySelector(".selected-rasp").innerHTML = res.groups.find((a) => a.link === selectElement.value).name;
            selectElement.value = "Group";
        })
        let selectElement2 = document.querySelector("#select-teacher");
        for (let teacher of res.teachers) {
            let teacherElement = document.createElement("GroupsAndTeachers");
            teacherElement.innerHTML = teacher.name;
            teacherElement.setAttribute("value", teacher.link);
            selectElement2.appendChild(teacherElement);
        }
        selectElement2.addEventListener("change", () => {
            updateData(selectElement2.value);
            document.querySelector(".selected-rasp").innerHTML = res.teachers.find((a) => a.link === selectElement2.value).name;
            selectElement2.value = "Teacher";
        })
    })

function updateData(url) {
    currentUrl = url;
    fetch(url)
        .then((data) => data.json()).then((res) => {
            generateSchedule(res);
            console.log(res);
            currentWeek = parseInt(res.currentWeek);
            if (currentWeek === 1) {
                document.querySelector("#previousWeek").style.visibility = "hidden";
            }
        })
}

function generateSchedule(data) {
    let table = document.querySelector("#schedule");
    for (let child of table.childNodes) {
        table.removeChild(child);
    }
    let header = table.insertRow();
    header.insertCell().appendChild(document.createTextNode("Время"));
    let ind = 0;
    for (let headerCell of data.date) {
        let cell = header.insertCell();
        cell.classList.add(`column-${ind}`);
        ind++;
        cell.appendChild(document.createTextNode(headerCell));
    }
    for (let i = 0; i < data.leftCol.length; i++) {
        let row = table.insertRow();
        let cellTime = row.insertCell();;
        cellTime.appendChild(document.createTextNode(data.leftCol[i].substr(0, 6)));
        cellTime.appendChild(document.createElement("br"));
        cellTime.appendChild(document.createTextNode(data.leftCol[i].substr(6)));
        for (let j = 0; j < 6; j++) {
            let cell = row.insertCell();
            cell.classList.add(`column-${j}`);
            if (data.lesson[j].subject === null) {
                continue;
            }
            let cellData = data.lesson[j];
            cell.appendChild(document.createTextNode(cellData.subject));
            cell.appendChild(document.createElement("br"));
            cell.appendChild(document.createTextNode(cellData.place));
            cell.appendChild(document.createElement("br"));
            let parsedGroupsAndTeachers = cellData.groups;
            parsedGroupsAndTeachers.push(cellData.teacher);
            for (let groupOrTeacher of parsedGroupsAndTeachers) {
                let groupOrTeacherInfo = JSON.parse(groupOrTeacher);
                if (groupOrTeacherInfo.link === null) {
                    continue;
                }
                let linkElem = document.createElement("a");
                linkElem.innerHTML = groupOrTeacherInfo.name;
                linkElem.addEventListener("click", () => updateData(groupOrTeacherInfo.link));
                linkElem.classList.add("group-link");
                cell.appendChild(linkElem);
                cell.appendChild(document.createElement("br"));
            }
        }
        data.lesson = data.lesson.slice(6, data.lesson.length);
    }
}

function changeWeek(goNextPage) {
    let index = currentUrl.indexOf("&");
    if (index !== -1) {
        currentUrl = currentUrl.slice(0, index);
    }
    currentUrl += "&selectedWeek=" + (goNextPage ? ++currentWeek : --currentWeek);
    updateData(currentUrl);
}

updateData(currentUrl);