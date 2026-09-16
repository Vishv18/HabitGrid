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

let graphDate = new Date();


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


    // ---------------------------------------------
    // CURRENT MONTH
    // ---------------------------------------------

    const year =
        graphDate.getFullYear();

    const month =
        graphDate.getMonth();


    const monthName =
        graphDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    // ---------------------------------------------
    // MONTH NAVIGATION
    // ---------------------------------------------

    const navigation =
        document.createElement("div");

    navigation.className =
        "month-navigation";


    navigation.innerHTML = `
        <h2>
            ${monthName}
        </h2>

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


    container.appendChild(
        navigation
    );


    // ---------------------------------------------
    // PREVIOUS MONTH
    // ---------------------------------------------

    document
        .getElementById("previousMonth")
        .addEventListener(
            "click",
            () => {

                graphDate =
                    new Date(
                        year,
                        month - 1,
                        1
                    );

                renderHabitGraphs();

            }
        );


    // ---------------------------------------------
    // NEXT MONTH
    // ---------------------------------------------

    document
        .getElementById("nextMonth")
        .addEventListener(
            "click",
            () => {

                graphDate =
                    new Date(
                        year,
                        month + 1,
                        1
                    );

                renderHabitGraphs();

            }
        );


    // ---------------------------------------------
    // TODAY
    // ---------------------------------------------

    document
        .getElementById("todayMonth")
        .addEventListener(
            "click",
            () => {

                graphDate = new Date();

                renderHabitGraphs();

            }
        );


    // ---------------------------------------------
    // DAYS IN MONTH
    // ---------------------------------------------

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ---------------------------------------------
    // FIRST DAY OF MONTH
    // ---------------------------------------------

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // Convert Sunday-based JS
    // to Monday-based layout

    let startingDay =
        firstDay.getDay();


    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    // =================================================
    // CREATE ONE GRAPH FOR EACH HABIT
    // =================================================

    habits.forEach(habit => {

        const card =
            document.createElement("div");

        card.className =
            "graph-card";


        // IMPORTANT:
        // The ID has NO spaces or line breaks.

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


        // ---------------------------------------------
        // FIND THE WEEKS CONTAINER
        // ---------------------------------------------

        const weeks =
            document.getElementById(
                `weeks-${habit.id}`
            );


        if (!weeks) {

            console.error(
                "Could not find graph container for:",
                habit.name
            );

            return;

        }


        // ---------------------------------------------
        // NUMBER OF WEEKS
        // ---------------------------------------------

        const totalCells =
            startingDay + daysInMonth;


        const numberOfWeeks =
            Math.ceil(
                totalCells / 7
            );


        // =================================================
        // CREATE WEEKS
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
                "week";


            // =================================================
            // CREATE 7 DAYS
            // =================================================

            for (
                let weekday = 0;
                weekday < 7;
                weekday++
            ) {

                const cellIndex =
                    week * 7 + weekday;


                const day =
                    cellIndex -
                    startingDay +
                    1;


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


                // ---------------------------------------------
                // EMPTY CELLS
                // ---------------------------------------------

                if (
                    day < 1 ||
                    day > daysInMonth
                ) {

                    box.classList.add(
                        "empty"
                    );

                    weekColumn.appendChild(
                        box
                    );

                    continue;

                }


                // ---------------------------------------------
                // DATE KEY
                // ---------------------------------------------

                const dateKey =
                    `${year}-${String(
                        month + 1
                    ).padStart(
                        2,
                        "0"
                    )}-${String(
                        day
                    ).padStart(
                        2,
                        "0"
                    )}`;


                // ---------------------------------------------
                // COMPLETED?
                // ---------------------------------------------

                if (
                    habit.completed[dateKey]
                    === true
                ) {

                    box.classList.add(
                        "done"
                    );

                }


                // ---------------------------------------------
                // TOOLTIP
                // ---------------------------------------------

                box.title =
                    `${habit.name} — ${dateKey}`;


                // ---------------------------------------------
                // CLICK BOX
                // ---------------------------------------------

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
    // Will be improved later.

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