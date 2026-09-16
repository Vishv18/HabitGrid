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
                No habits yet. Add your first habit!
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
                class="habit-color"
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
                    class="habit-color"
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
                    ✏ Edit
                </button>

                <button
                    class="remove-btn"
                >
                    🗑 Remove
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


    // EDIT EXISTING HABIT

    if (editingHabitId) {

        const habit =
            habits.find(
                habit =>
                    habit.id === editingHabitId
            );

        if (habit) {

            // Keep completion history

            habit.name = name;

            habit.color = selectedColor;

        }

    }


    // ADD NEW HABIT

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
// YEAR GRAPH STATE
// =====================================================

// Start with the current year

let graphYear =
    new Date().getFullYear();


// =====================================================
// GET YEAR START
// =====================================================

function getYearStart(year) {

    return new Date(
        year,
        0,
        1
    );

}


// =====================================================
// GET YEAR END
// =====================================================

function getYearEnd(year) {

    return new Date(
        year,
        11,
        31
    );

}


// =====================================================
// MONDAY-BASED DAY INDEX
// =====================================================

function getMondayIndex(date) {

    const day =
        date.getDay();

    // JavaScript:
    // Sunday = 0
    // Monday = 1
    // ...
    // Saturday = 6

    return day === 0
        ? 6
        : day - 1;

}


// =====================================================
// RENDER YEAR CALENDAR
// =====================================================

function renderHabitGraphs() {

    const container =
        document.getElementById(
            "habitGraphs"
        );

    container.innerHTML = "";


    // =================================================
    // NO HABITS
    // =================================================

    if (habits.length === 0) {

        container.innerHTML = `
            <div class="card empty">
                Add a habit to start tracking.
            </div>
        `;

        return;

    }


    // =================================================
    // YEAR NAVIGATION
    // =================================================

    const navigation =
        document.createElement("div");

    navigation.className =
        "year-navigation";


    navigation.innerHTML = `
        <h2>
            ${graphYear}
        </h2>

        <div class="year-buttons">

            <button
                class="month-btn"
                id="previousYear"
            >
                ←
            </button>

            <button
                class="month-btn"
                id="currentYear"
            >
                Current Year
            </button>

            <button
                class="month-btn"
                id="nextYear"
            >
                →
            </button>

        </div>
    `;


    container.appendChild(
        navigation
    );


    // =================================================
    // PREVIOUS YEAR
    // =================================================

    document
        .getElementById("previousYear")
        .addEventListener(
            "click",
            () => {

                graphYear--;

                renderHabitGraphs();

            }
        );


    // =================================================
    // NEXT YEAR
    // =================================================

    document
        .getElementById("nextYear")
        .addEventListener(
            "click",
            () => {

                graphYear++;

                renderHabitGraphs();

            }
        );


    // =================================================
    // CURRENT YEAR
    // =================================================

    document
        .getElementById("currentYear")
        .addEventListener(
            "click",
            () => {

                graphYear =
                    new Date().getFullYear();

                renderHabitGraphs();

            }
        );


    // =================================================
    // YEAR INFORMATION
    // =================================================

    const yearStart =
        getYearStart(graphYear);

    const yearEnd =
        getYearEnd(graphYear);


    const startingDay =
        getMondayIndex(yearStart);

    const endingDay =
        getMondayIndex(yearEnd);


    // Number of days in year

    const daysInYear =
        (
            new Date(
                graphYear,
                11,
                31
            ) -
            new Date(
                graphYear,
                0,
                1
            )
        ) /
        (
            1000 *
            60 *
            60 *
            24
        ) + 1;


    // =================================================
    // NUMBER OF WEEKS
    // =================================================

    const totalCells =
        startingDay +
        daysInYear;


    const numberOfWeeks =
        Math.ceil(
            totalCells / 7
        );


    // =================================================
    // CREATE GRAPH FOR EACH HABIT
    // =================================================

    habits.forEach(habit => {

        const card =
            document.createElement("div");

        card.className =
            "graph-card";


        // =================================================
        // HABIT TITLE
        // =================================================

        const title =
            document.createElement("div");

        title.className =
            "graph-title";

        title.innerHTML = `
            <div
                class="habit-color"
                style="background:${habit.color}"
            ></div>

            <strong>
                ${escapeHTML(habit.name)}
            </strong>
        `;


        card.appendChild(title);


        // =================================================
        // GRAPH WRAPPER
        // =================================================

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "year-graph-wrapper";


        // =================================================
        // MONTH LABELS
        // =================================================

        const monthLabels =
            document.createElement("div");

        monthLabels.className =
            "year-month-labels";


        // Empty space for weekday labels

        const emptyLabel =
            document.createElement("div");

        emptyLabel.className =
            "weekday-spacer";

        monthLabels.appendChild(
            emptyLabel
        );


        // Create month positions

        for (
            let month = 0;
            month < 12;
            month++
        ) {

            const firstOfMonth =
                new Date(
                    graphYear,
                    month,
                    1
                );


            const dayOfYear =
                Math.floor(
                    (
                        firstOfMonth -
                        yearStart
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            const weekIndex =
                Math.floor(
                    (
                        startingDay +
                        dayOfYear
                    ) / 7
                );


            const label =
                document.createElement(
                    "span"
                );

            label.textContent =
                firstOfMonth.toLocaleDateString(
                    "en-IN",
                    {
                        month: "short"
                    }
                );


            label.style.gridColumn =
                `${weekIndex + 2}`;


            monthLabels.appendChild(
                label
            );

        }


        wrapper.appendChild(
            monthLabels
        );


        // =================================================
        // CALENDAR BODY
        // =================================================

        const calendar =
            document.createElement("div");

        calendar.className =
            "year-calendar";


        // =================================================
        // WEEKDAY LABELS
        // =================================================

        const weekdays =
            document.createElement("div");

        weekdays.className =
            "year-weekdays";


        const weekdayNames = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];


        weekdayNames.forEach(
            name => {

                const label =
                    document.createElement(
                        "span"
                    );

                label.textContent =
                    name;

                weekdays.appendChild(
                    label
                );

            }
        );


        calendar.appendChild(
            weekdays
        );


        // =================================================
        // WEEK CONTAINER
        // =================================================

        const weeks =
            document.createElement(
                "div"
            );

        weeks.className =
            "year-weeks";


        // =================================================
        // CREATE EVERY WEEK
        // =================================================

        for (
            let week = 0;
            week < numberOfWeeks;
            week++
        ) {

            const weekColumn =
                document.createElement(
                    "div"
                );

            weekColumn.className =
                "year-week";


            // =================================================
            // CREATE 7 DAYS
            // =================================================

            for (
                let weekday = 0;
                weekday < 7;
                weekday++
            ) {

                const cellIndex =
                    week * 7 +
                    weekday;


                const dayOffset =
                    cellIndex -
                    startingDay;


                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "day-box";


                box.style.setProperty(
                    "--habit-color",
                    habit.color
                );


                // =================================================
                // CHECK IF VALID DATE
                // =================================================

                if (
                    dayOffset < 0 ||
                    dayOffset >= daysInYear
                ) {

                    box.classList.add(
                        "empty"
                    );

                    weekColumn.appendChild(
                        box
                    );

                    continue;

                }


                // =================================================
                // CREATE DATE
                // =================================================

                const currentDate =
                    new Date(
                        graphYear,
                        0,
                        1
                    );


                currentDate.setDate(
                    currentDate.getDate() +
                    dayOffset
                );


                const dateKey =
                    formatDateKey(
                        currentDate
                    );


                // =================================================
                // COMPLETED
                // =================================================

                if (
                    habit.completed[dateKey]
                    === true
                ) {

                    box.classList.add(
                        "done"
                    );

                }


                // =================================================
                // TODAY INDICATOR
                // =================================================

                const today =
                    new Date();


                if (
                    currentDate.getFullYear() ===
                    today.getFullYear() &&
                    currentDate.getMonth() ===
                    today.getMonth() &&
                    currentDate.getDate() ===
                    today.getDate()
                ) {

                    box.classList.add(
                        "today"
                    );

                }


                // =================================================
                // TOOLTIP
                // =================================================

                const readableDate =
                    currentDate.toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );


                box.title =
                    `${habit.name} — ${readableDate}`;


                // =================================================
                // CLICK DATE
                // =================================================

                box.addEventListener(
                    "click",
                    () => {

                        habit.completed[dateKey] =
                            !habit.completed[dateKey];

                        saveData();

                        renderAll();

                    }
                );


                weekColumn.appendChild(
                    box
                );

            }


            weeks.appendChild(
                weekColumn
            );

        }


        calendar.appendChild(
            weeks
        );


        wrapper.appendChild(
            calendar
        );


        card.appendChild(
            wrapper
        );


        container.appendChild(
            card
        );

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


    let totalCompleted = 0;

    let totalPossible = 0;


    habits.forEach(habit => {

        Object.values(
            habit.completed
        ).forEach(done => {

            totalPossible++;

            if (done) {

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


    // Temporary longest streak

    document.getElementById(
        "longestStreak"
    ).textContent =
        currentStreak;


    document.getElementById(
        "completionRate"
    ).textContent =
        `${completionRate}%`;


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