// =====================================================
// HABITGRID
// Personal Habit Tracker
// =====================================================


// =====================================================
// DEFAULT HABITS
// =====================================================

const defaultHabits = [
    {
        id: "cycling",
        name: "Cycling",
        color: "#39d353",
        completed: {}
    },
    {
        id: "study",
        name: "Study",
        color: "#58a6ff",
        completed: {}
    },
    {
        id: "project",
        name: "Project Work",
        color: "#f2cc60",
        completed: {}
    },
    {
        id: "workout",
        name: "Workout",
        color: "#bc8cff",
        completed: {}
    }
];


// =====================================================
// LOAD HABITS
// =====================================================

let habits = JSON.parse(
    localStorage.getItem("habitGridHabits")
);

if (!habits) {
    habits = defaultHabits;
    saveData();
}


// =====================================================
// SAVE DATA
// =====================================================

function saveData() {

    localStorage.setItem(
        "habitGridHabits",
        JSON.stringify(habits)
    );

}


// =====================================================
// DATE FUNCTIONS
// =====================================================

function formatDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getTodayKey() {

    return formatDateKey(new Date());

}


function formatToday() {

    return new Date().toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// =====================================================
// HEADER
// =====================================================

function updateHeader() {

    const date = new Date();

    document.getElementById(
        "currentDate"
    ).textContent = date.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

    document.getElementById(
        "todayDate"
    ).textContent = formatToday();

}


// =====================================================
// TODAY'S HABITS
// =====================================================

function renderTodayHabits() {

    const container =
        document.getElementById("todayHabits");

    container.innerHTML = "";

    if (habits.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No habits yet. Click "+ Add Habit" above to start tracking!
            </div>
        `;

        updateProgress();

        return;
    }

    const today = getTodayKey();

    habits.forEach(habit => {

        const done =
            habit.completed[today] === true;

        const item =
            document.createElement("div");

        item.className =
            `today-habit ${done ? "done" : ""}`;

        item.style.setProperty(
            "--habit-color",
            habit.color
        );

        item.innerHTML = `
            <div
                class="habit-color-dot"
                style="background:${habit.color}"
            ></div>

            <span>
                ${escapeHTML(habit.name)}
            </span>

            <div class="today-checkbox"></div>
        `;

        item.addEventListener(
            "click",
            () => toggleTodayHabit(habit.id)
        );

        container.appendChild(item);

    });

    updateProgress();

}


// =====================================================
// TOGGLE TODAY'S HABIT
// =====================================================

function toggleTodayHabit(id) {

    const today = getTodayKey();

    const habit =
        habits.find(
            habit => habit.id === id
        );

    if (!habit) return;

    habit.completed[today] =
        !habit.completed[today];

    saveData();

    renderAll();

}


// =====================================================
// TODAY'S PROGRESS
// =====================================================

function updateProgress() {

    const today = getTodayKey();

    const completed =
        habits.filter(
            habit =>
                habit.completed[today] === true
        ).length;

    document.getElementById(
        "progressText"
    ).textContent =
        `${completed} / ${habits.length}`;

    const fillBar = document.getElementById("progressBarFill");
    if (fillBar) {
        const pct = habits.length ? Math.round((completed / habits.length) * 100) : 0;
        fillBar.style.width = `${pct}%`;
    }

}


// =====================================================
// HABIT MANAGEMENT LIST
// =====================================================

function renderHabitList() {

    const container =
        document.getElementById("habitList");

    container.innerHTML = "";

    if (habits.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No habits added yet.
            </div>
        `;

        return;
    }

    habits.forEach(habit => {

        const item =
            document.createElement("div");

        item.className = "habit-item";

        item.innerHTML = `
            <div class="habit-info">

                <div
                    class="habit-color-dot"
                    style="background:${habit.color}"
                ></div>

                <span>
                    ${escapeHTML(habit.name)}
                </span>

            </div>

            <div class="habit-actions">

                <button
                    class="edit-btn"
                >
                    Edit
                </button>

                <button
                    class="remove-btn"
                >
                    Remove
                </button>

            </div>
        `;


        // EDIT BUTTON

        item.querySelector(
            ".edit-btn"
        ).addEventListener(
            "click",
            () => openEditHabit(habit.id)
        );


        // REMOVE BUTTON

        item.querySelector(
            ".remove-btn"
        ).addEventListener(
            "click",
            () => removeHabit(habit.id)
        );


        container.appendChild(item);

    });

}


// =====================================================
// MODAL ELEMENTS
// =====================================================

const modal =
    document.getElementById("habitModal");

const addHabitBtn =
    document.getElementById("addHabitBtn");

const closeModal =
    document.getElementById("closeModal");

const saveHabitBtn =
    document.getElementById("saveHabitBtn");

const habitName =
    document.getElementById("habitName");

const modalTitle =
    document.getElementById("modalTitle");


// =====================================================
// MODAL STATE
// =====================================================

let selectedColor = "#39d353";

let editingHabitId = null;


// =====================================================
// OPEN ADD HABIT MODAL
// =====================================================

addHabitBtn.addEventListener(
    "click",
    () => {

        editingHabitId = null;

        modalTitle.textContent =
            "Add New Habit";

        saveHabitBtn.textContent =
            "Add Habit";

        habitName.value = "";

        setSelectedColor("#39d353");

        modal.classList.remove("hidden");

        habitName.focus();

    }
);


// =====================================================
// CLOSE MODAL
// =====================================================

closeModal.addEventListener(
    "click",
    closeHabitModal
);


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            closeHabitModal();

        }

    }
);


function closeHabitModal() {

    modal.classList.add("hidden");

    habitName.value = "";

    editingHabitId = null;

}


// =====================================================
// EXPORT DATA — v2
// =====================================================

function exportData() {

    // Read from localStorage using the existing key
    const storedData = localStorage.getItem("habitGridHabits");

    let dataToExport = null;

    if (storedData) {
        try {
            dataToExport = JSON.parse(storedData);
        } catch (e) {
            dataToExport = null;
        }
    }

    // Fallback: use the live in-memory habits array
    if (
        (!dataToExport || (Array.isArray(dataToExport) && dataToExport.length === 0)) &&
        typeof habits !== "undefined" &&
        Array.isArray(habits) &&
        habits.length > 0
    ) {
        dataToExport = habits;
        saveData(); // persist to localStorage before exporting
    }

    // Nothing to export
    if (!dataToExport || (Array.isArray(dataToExport) && dataToExport.length === 0)) {
        alert("No HabitGrid data found to export.");
        return;
    }

    // Build pretty-printed JSON string
    const jsonString = JSON.stringify(dataToExport, null, 2);

    // Build filename: HabitGrid_Backup_YYYY-MM-DD.json
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const filename = `HabitGrid_Backup_${yyyy}-${mm}-${dd}.json`;

    // Try Blob URL first (works on http:// origins)
    try {
        const blob = new Blob([jsonString], { type: "application/json" });
        const blobURL = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobURL;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke after a short delay so the browser can start the download
        setTimeout(function () { URL.revokeObjectURL(blobURL); }, 1000);

    } catch (blobError) {
        // Fallback: Data URI (works everywhere including file:// origins)
        const dataURI = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);

        const a = document.createElement("a");
        a.href = dataURI;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Delegated listener: attached ONCE to document, so it keeps working even if
// #exportBtn's parent container ever gets re-rendered (innerHTML replaced),
// which would silently detach a directly-bound listener on the old node.
document.addEventListener("click", function (event) {
    const target = event.target.closest("#exportBtn");
    if (target) {
        exportData();
    }
});


// =====================================================
// COLOR OPTIONS
// =====================================================

document
    .querySelectorAll(".color-option")
    .forEach(option => {

        option.addEventListener(
            "click",
            () => {

                setSelectedColor(
                    option.dataset.color
                );

            }
        );

    });


function setSelectedColor(color) {

    selectedColor = color;

    document
        .querySelectorAll(".color-option")
        .forEach(option => {

            option.classList.toggle(
                "selected",
                option.dataset.color === color
            );

        });

}


// =====================================================
// SAVE HABIT
// =====================================================

saveHabitBtn.addEventListener(
    "click",
    saveHabit
);


habitName.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            saveHabit();

        }

    }
);


function saveHabit() {

    const name =
        habitName.value.trim();

    if (!name) {

        alert("Please enter a habit name.");

        return;
    }


    // =============================================
    // EDIT EXISTING HABIT
    // =============================================

    if (editingHabitId) {

        const habit =
            habits.find(
                habit =>
                    habit.id === editingHabitId
            );

        if (habit) {

            // Keep existing completion history

            habit.name = name;

            habit.color = selectedColor;

        }

    }


    // =============================================
    // ADD NEW HABIT
    // =============================================

    else {

        const newHabit = {

            id: Date.now().toString(),

            name: name,

            color: selectedColor,

            completed: {}

        };

        habits.push(newHabit);

    }


    saveData();

    closeHabitModal();

    renderAll();

}


// =====================================================
// OPEN EDIT HABIT
// =====================================================

function openEditHabit(id) {

    const habit =
        habits.find(
            habit => habit.id === id
        );

    if (!habit) return;


    editingHabitId = habit.id;

    modalTitle.textContent =
        "Edit Habit";

    saveHabitBtn.textContent =
        "Save Changes";

    habitName.value =
        habit.name;

    setSelectedColor(
        habit.color
    );

    modal.classList.remove(
        "hidden"
    );

    habitName.focus();

}


// =====================================================
// REMOVE HABIT
// =====================================================

function removeHabit(id) {

    const habit =
        habits.find(
            habit => habit.id === id
        );

    if (!habit) return;


    const confirmed =
        confirm(
            `Remove "${habit.name}"?\n\n` +
            `This will permanently remove ` +
            `the habit and its completion history.`
        );


    if (!confirmed) return;


    habits =
        habits.filter(
            habit => habit.id !== id
        );


    saveData();

    renderAll();

}


// =====================================================
// GRAPH MONTH
// =====================================================

// =====================================================
// GRAPH VIEW STATE
// =====================================================

let graphDate = new Date();
let viewMode = "year"; // "year" or "month"


// =====================================================
// HABIT GRAPH
// =====================================================

function renderHabitGraphs() {

    const container =
        document.getElementById(
            "habitGraphs"
        );

    container.innerHTML = "";


    // ---------------------------------------------
    // NO HABITS
    // ---------------------------------------------

    if (habits.length === 0) {

        container.innerHTML = `
            <div class="card empty">
                Add a habit to start tracking.
            </div>
        `;

        return;

    }

    if (viewMode === "year") {
        renderYearHabitGraphs(container);
    } else {
        renderMonthHabitGraphs(container);
    }

}


// =====================================================
// FULL YEAR HABIT GRAPH
// =====================================================

function renderYearHabitGraphs(container) {

    const year = graphDate.getFullYear();
    const todayKey = getTodayKey();


    // ---------------------------------------------
    // YEAR NAVIGATION & VIEW TOGGLE
    // ---------------------------------------------

    const navigation = document.createElement("div");
    navigation.className = "year-navigation";

    navigation.innerHTML = `
        <div class="year-nav-left">
            <h2>${year} Activity</h2>

            <div class="view-toggle">
                <button
                    class="month-btn active"
                    id="viewYearBtn"
                >
                    Full Year
                </button>

                <button
                    class="month-btn"
                    id="viewMonthBtn"
                >
                    Month View
                </button>
            </div>
        </div>

        <div class="year-buttons">
            <button
                class="month-btn"
                id="previousYear"
            >
                ← ${year - 1}
            </button>

            <button
                class="month-btn"
                id="todayYear"
            >
                Current Year
            </button>

            <button
                class="month-btn"
                id="nextYear"
            >
                ${year + 1} →
            </button>
        </div>
    `;

    container.appendChild(navigation);


    // ---------------------------------------------
    // NAVIGATION LISTENERS
    // ---------------------------------------------

    document
        .getElementById("previousYear")
        .addEventListener("click", () => {
            graphDate = new Date(year - 1, graphDate.getMonth(), 1);
            renderHabitGraphs();
        });

    document
        .getElementById("nextYear")
        .addEventListener("click", () => {
            graphDate = new Date(year + 1, graphDate.getMonth(), 1);
            renderHabitGraphs();
        });

    document
        .getElementById("todayYear")
        .addEventListener("click", () => {
            graphDate = new Date();
            renderHabitGraphs();
        });

    document
        .getElementById("viewYearBtn")
        .addEventListener("click", () => {
            viewMode = "year";
            renderHabitGraphs();
        });

    document
        .getElementById("viewMonthBtn")
        .addEventListener("click", () => {
            viewMode = "month";
            renderHabitGraphs();
        });


    // ---------------------------------------------
    // YEAR CALENDAR COMPUTATION
    // ---------------------------------------------

    const jan1 = new Date(year, 0, 1);
    let jan1Day = jan1.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    let startingDay = jan1Day === 0 ? 6 : jan1Day - 1; // 0 = Mon, 1 = Tue ... 6 = Sun

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDaysInYear = isLeapYear ? 366 : 365;

    const totalCells = startingDay + totalDaysInYear;
    const numberOfWeeks = Math.ceil(totalCells / 7);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthColumns = [];

    for (let m = 0; m < 12; m++) {
        const firstOfMonth = new Date(year, m, 1);
        const diffTime = firstOfMonth - jan1;
        const dayOfYearIndex = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const cellIndex = dayOfYearIndex - 1 + startingDay;
        const weekCol = Math.floor(cellIndex / 7);
        monthColumns.push({ name: monthNames[m], col: weekCol + 2 });
    }


    // ---------------------------------------------
    // HABIT GRAPHS FOR EACH HABIT
    // ---------------------------------------------

    habits.forEach(habit => {

        const card = document.createElement("div");
        card.className = "graph-card";

        let monthLabelsHTML = `<div class="year-month-labels" style="grid-template-columns: 45px repeat(${numberOfWeeks}, 20px);"><span></span>`;
        monthColumns.forEach(mc => {
            monthLabelsHTML += `<span style="grid-column: ${mc.col}">${mc.name}</span>`;
        });
        monthLabelsHTML += `</div>`;

        card.innerHTML = `
            <div class="graph-title">
                <div
                    class="habit-color"
                    style="background:${habit.color}"
                ></div>

                <strong>
                    ${escapeHTML(habit.name)}
                </strong>
            </div>

            <div class="year-graph-wrapper">
                ${monthLabelsHTML}

                <div class="year-calendar">
                    <div class="year-weekdays">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>

                    <div
                        class="year-weeks"
                        id="weeks-${habit.id}"
                    ></div>
                </div>
            </div>
        `;

        container.appendChild(card);

        const weeksContainer = document.getElementById(`weeks-${habit.id}`);

        for (let week = 0; week < numberOfWeeks; week++) {

            const weekColumn = document.createElement("div");
            weekColumn.className = "year-week";

            for (let weekday = 0; weekday < 7; weekday++) {

                const cellIndex = week * 7 + weekday;
                const dateObj = new Date(year, 0, cellIndex - startingDay + 1);
                const dateKey = formatDateKey(dateObj);

                const box = document.createElement("div");
                box.className = "day-box";
                box.style.setProperty("--habit-color", habit.color);

                if (dateObj.getFullYear() !== year) {
                    box.classList.add("other-year");
                }

                if (habit.completed[dateKey] === true) {
                    box.classList.add("done");
                }

                if (dateKey === todayKey) {
                    box.classList.add("today");
                }

                const formattedDateStr = dateObj.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

                const statusStr = habit.completed[dateKey] ? "Completed" : "Not completed";
                box.title = `${habit.name}: ${formattedDateStr} (${statusStr})`;

                box.addEventListener("click", () => {
                    habit.completed[dateKey] = !habit.completed[dateKey];
                    saveData();
                    renderAll();
                });

                weekColumn.appendChild(box);

            }

            weeksContainer.appendChild(weekColumn);

        }

    });

    // Auto scroll current year graph to today's date
    if (year === new Date().getFullYear()) {
        setTimeout(() => {
            const wrappers = container.querySelectorAll(".year-graph-wrapper");
            wrappers.forEach(wrapper => {
                const todayBox = wrapper.querySelector(".day-box.today");
                if (todayBox) {
                    const boxOffset = todayBox.offsetLeft;
                    const wrapperWidth = wrapper.clientWidth;
                    wrapper.scrollLeft = Math.max(0, boxOffset - wrapperWidth / 2 + 10);
                }
            });
        }, 0);
    }

}


// =====================================================
// SINGLE MONTH HABIT GRAPH
// =====================================================

function renderMonthHabitGraphs(container) {

    const year = graphDate.getFullYear();
    const month = graphDate.getMonth();

    const monthName = graphDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });


    // ---------------------------------------------
    // MONTH NAVIGATION & VIEW TOGGLE
    // ---------------------------------------------

    const navigation = document.createElement("div");
    navigation.className = "year-navigation";

    navigation.innerHTML = `
        <div class="year-nav-left">
            <h2>${monthName}</h2>

            <div class="view-toggle">
                <button
                    class="month-btn"
                    id="viewYearBtn"
                >
                    Full Year
                </button>

                <button
                    class="month-btn active"
                    id="viewMonthBtn"
                >
                    Month View
                </button>
            </div>
        </div>

        <div class="month-buttons">
            <button
                class="month-btn"
                id="previousMonth"
            >
                ←
            </button>

            <button
                class="month-btn"
                id="todayMonth"
            >
                Today
            </button>

            <button
                class="month-btn"
                id="nextMonth"
            >
                →
            </button>
        </div>
    `;

    container.appendChild(navigation);


    // ---------------------------------------------
    // NAVIGATION LISTENERS
    // ---------------------------------------------

    document.getElementById("previousMonth").addEventListener("click", () => {
        graphDate = new Date(year, month - 1, 1);
        renderHabitGraphs();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        graphDate = new Date(year, month + 1, 1);
        renderHabitGraphs();
    });

    document.getElementById("todayMonth").addEventListener("click", () => {
        graphDate = new Date();
        renderHabitGraphs();
    });

    document.getElementById("viewYearBtn").addEventListener("click", () => {
        viewMode = "year";
        renderHabitGraphs();
    });

    document.getElementById("viewMonthBtn").addEventListener("click", () => {
        viewMode = "month";
        renderHabitGraphs();
    });


    // ---------------------------------------------
    // DAYS IN MONTH
    // ---------------------------------------------

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);

    let startingDay = firstDay.getDay();
    startingDay = startingDay === 0 ? 6 : startingDay - 1;


    // ---------------------------------------------
    // HABIT GRAPHS
    // ---------------------------------------------

    habits.forEach(habit => {

        const card = document.createElement("div");
        card.className = "graph-card";

        card.innerHTML = `
            <div class="graph-title">
                <div
                    class="habit-color"
                    style="background:${habit.color}"
                ></div>

                <strong>
                    ${escapeHTML(habit.name)}
                </strong>
            </div>

            <div class="graph-wrapper">
                <div class="calendar">
                    <div class="weekday-labels">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>

                    <div
                        class="weeks"
                        id="weeks-${habit.id}"
                    ></div>
                </div>
            </div>
        `;

        container.appendChild(card);

        const weeks = document.getElementById(`weeks-${habit.id}`);
        if (!weeks) return;

        const totalCells = startingDay + daysInMonth;
        const numberOfWeeks = Math.ceil(totalCells / 7);

        for (let week = 0; week < numberOfWeeks; week++) {

            const weekColumn = document.createElement("div");
            weekColumn.className = "week";

            for (let weekday = 0; weekday < 7; weekday++) {

                const cellIndex = week * 7 + weekday;
                const day = cellIndex - startingDay + 1;
                const dateObj = new Date(year, month, day);
                const dateKey = formatDateKey(dateObj);

                const box = document.createElement("div");
                box.className = "day-box";
                box.style.setProperty("--habit-color", habit.color);

                if (dateObj.getMonth() !== month) {
                    box.classList.add("other-month");
                }

                if (habit.completed[dateKey] === true) {
                    box.classList.add("done");
                }

                if (dateKey === getTodayKey()) {
                    box.classList.add("today");
                }

                const formattedDateStr = dateObj.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

                box.title = `${habit.name}: ${formattedDateStr}`;

                box.addEventListener("click", () => {
                    habit.completed[dateKey] = !habit.completed[dateKey];
                    saveData();
                    renderAll();
                });

                weekColumn.appendChild(box);

            }

            weeks.appendChild(weekColumn);

        }

    });

}



// =====================================================
// STATISTICS
// =====================================================

function updateStatistics() {

    if (habits.length === 0) {

        document.getElementById(
            "currentStreak"
        ).textContent = "0";

        document.getElementById(
            "longestStreak"
        ).textContent = "0";

        document.getElementById(
            "completionRate"
        ).textContent = "0%";

        document.getElementById(
            "daysCompleted"
        ).textContent = "0";

        return;

    }


    // =================================================
    // COMPLETION STATISTICS
    // =================================================

    let totalCompleted = 0;

    let totalPossible = 0;


    habits.forEach(habit => {

        const recordedDates =
            Object.keys(
                habit.completed
            );


        // Each recorded date represents
        // one possible habit completion.

        totalPossible +=
            recordedDates.length;


        recordedDates.forEach(dateKey => {

            if (
                habit.completed[dateKey]
                === true
            ) {

                totalCompleted++;

            }

        });

    });


    let completionRate = 0;


    if (totalPossible > 0) {

        completionRate =
            Math.round(
                (
                    totalCompleted /
                    totalPossible
                ) * 100
            );

    }


    // =================================================
    // CURRENT STREAK
    // =================================================

    let currentStreak = 0;

    const today = new Date();


    for (
        let i = 0;
        i < 365;
        i++
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - i
        );


        const key =
            formatDateKey(date);


        const allDone =
            habits.every(
                habit =>
                    habit.completed[key]
                    === true
            );


        if (allDone) {

            currentStreak++;

        }
        else {

            break;

        }

    }


    document.getElementById(
        "currentStreak"
    ).textContent =
        currentStreak;


    // =================================================
    // LONGEST STREAK
    // =================================================

    let longestStreak = 0;

    let runningStreak = 0;


    // Store dates where ALL habits
    // were completed.

    const completedDates =
        new Set();


    habits.forEach(habit => {

        Object.keys(
            habit.completed
        ).forEach(dateKey => {

            if (
                habit.completed[dateKey]
                === true
            ) {

                const allHabitsDone =
                    habits.every(
                        otherHabit =>
                            otherHabit.completed[dateKey]
                            === true
                    );


                if (allHabitsDone) {

                    completedDates.add(
                        dateKey
                    );

                }

            }

        });

    });


    // Sort dates chronologically

    const sortedDates =
        Array.from(
            completedDates
        ).sort();


    // Find longest consecutive sequence

    for (
        let i = 0;
        i < sortedDates.length;
        i++
    ) {

        if (i === 0) {

            runningStreak = 1;

        }
        else {

            const previousDate =
                new Date(
                    sortedDates[i - 1]
                );

            const currentDate =
                new Date(
                    sortedDates[i]
                );


            const difference =
                Math.round(
                    (
                        currentDate -
                        previousDate
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            if (difference === 1) {

                runningStreak++;

            }
            else {

                runningStreak = 1;

            }

        }


        if (
            runningStreak >
            longestStreak
        ) {

            longestStreak =
                runningStreak;

        }

    }


    document.getElementById(
        "longestStreak"
    ).textContent =
        longestStreak;


    // =================================================
    // COMPLETION RATE
    // =================================================

    document.getElementById(
        "completionRate"
    ).textContent =
        `${completionRate}%`;


    // =================================================
    // DAYS COMPLETED
    // =================================================

    document.getElementById(
        "daysCompleted"
    ).textContent =
        totalCompleted;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}


// =====================================================
// RENDER EVERYTHING
// =====================================================

function renderAll() {

    updateHeader();

    renderTodayHabits();

    renderHabitList();

    renderHabitGraphs();

    updateStatistics();

}


// =====================================================
// START APPLICATION
// =====================================================

renderAll();