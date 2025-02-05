<template>
    <div class="date-picker" :style="{
        '--primary-color': primaryColor,
        '--accent-color': accentColor,
        '--text-color': textColor
    }">
        <input type="text" v-model="selectedDateDisplay" readonly @click="toggleCalendar" :placeholder="placeholder"
            :style="inputComputedStyle" />

        <div v-if="calendarVisible" class="calendar">
            <!-- Calendar Header -->
            <div class="calendar-header">
                <button class="nav-button" @click="previousMonth">&lt;</button>
                <div class="month-info">
                    <div class="month-display">{{ currentMonthDisplay }}</div>
                    <div class="english-range" v-if="data && data.metadata && data.metadata.en && showEnglishDate">
                        {{ data.metadata.en }}
                    </div>
                </div>
                <button class="nav-button" @click="nextMonth">&gt;</button>
            </div>

            <!-- Calendar Body -->
            <div class="calendar-body">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(day, index) in weekDays" :key="index">{{ day }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(week, wIndex) in weeks" :key="wIndex">
                            <td v-for="(day, dIndex) in week" :key="dIndex" :class="{
                                selectable: day && day.n,
                                selected: isSelected(day),
                                today: !isSelected(day) && isToday(day)
                            }" @click="day && day.n ? selectDay(day) : null">
                                <div v-if="day && day.n">
                                    <div class="nepali-date">{{ day.n }}</div>
                                    <div class="english-date" v-if="showEnglishDate">{{ day.e }}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { getNepaliDateData, modules } from '../utils/dataLoader'

export default {
    name: 'NepaliDatePicker',
    props: {
        // Whether to display the English day value (day.e) in each cell.
        showEnglishDate: {
            type: Boolean,
            default: true
        },
        // Primary color used for highlighting (passed via CSS variable).
        primaryColor: {
            type: String,
            default: "#fbc02d"
        },
        // Accent color used for the header background.
        accentColor: {
            type: String,
            default: "#ffeb3b"
        },
        // Default text color.
        textColor: {
            type: String,
            default: "#333"
        },
        // Placeholder for the input field.
        placeholder: {
            type: String,
            default: "Select a date"
        },
        // Initial date can be provided as a string in "yyyy-mm-dd" (Nepali date) or an object (old behavior).
        initialDate: {
            type: [Object, String],
            default: null
        },
        // Optional minimum selectable date (as an object with properties: nepaliYear, nepaliMonth, day).
        minDate: {
            type: Object,
            default: null
        },
        // Optional maximum selectable date.
        maxDate: {
            type: Object,
            default: null
        },
        // Allows overriding of the input field's CSS styles.
        inputStyles: {
            type: Object,
            default: () => ({})
        },
        // Determines the format of the returned value.
        // Options: "detailed" returns the full day object, "yyyy-mm-dd" returns a formatted string,  or a custom function that takes (year, month, day) as arguments.
        returnFormat: {
            type: [String, Function],
            default: 'yyyy-mm-dd'
        },
        // Determines the display format for the input field.
        // If not provided, it defaults to "day.n (metadata.np)".
        displayFormat: {
            type: String,
            default: ''
        },
        // Locale for weekday headers; "en" for English (default) or "np" for Nepali.
        locale: {
            type: String,
            default: "en"
        },
        // Custom separator to be used in formatted date strings.
        customSeparator: {
            type: String,
            default: "-"
        },
        // Specifies whether the emitted value is a string or an object.
        valueType: {
            type: String,
            default: "string"
        }
    },
    data() {
        return {
            // Controls whether the calendar popover is visible.
            calendarVisible: false,
            // Stores the selected day object. When a day is selected, we add its Nepali year and month.
            selectedDate: null,
            // The string that is shown in the input field.
            selectedDateDisplay: '',
            // Holds the JSON data for the currently displayed month.
            data: null,
            // An array of weeks (each week is an array of 7 day objects).
            weeks: [],
            // The currently displayed Nepali year and month.
            currentYear: '',
            currentMonth: '',
            // The actual "today" in Nepali date (computed from system date).
            currentNepaliToday: null,
            // If initialDate is provided as a string, this holds the day portion (in Arabic numerals).
            initialDayArabic: null
        }
    },
    computed: {
        // Computes weekday headers based on the locale prop.
        weekDays() {
            return this.locale === 'np'
                ? ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि']
                : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        },
        // Computes the display string for the current month. If JSON metadata is available, it uses that;
        // otherwise, it falls back to the format "currentMonth/currentYear".
        currentMonthDisplay() {
            return this.data && this.data.metadata && this.data.metadata.np
                ? this.data.metadata.np
                : `${this.currentMonth}/${this.currentYear}`;
        },
        // Merges default input styles with any user-provided styles via the inputStyles prop.
        inputComputedStyle() {
            return Object.assign({ width: "200px", border: "1px solid #ccc" }, this.inputStyles);
        }
    },
    methods: {
        convertToNepaliNumerals(arabicStr) {
            const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
            return arabicStr.split('').map(ch => map[ch] || ch).join('');
        },
        monthNameToNumber(name) {
            const map = {
                Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
                Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
            };
            return map[name] || 0;
        },
        pad(value) {
            const str = String(value);
            return str.length < 2 ? '0' + str : str;
        },
        formatDate(format, year, month, day, customSeparator) {
            return format
                .replace(/yyyy/g, year)
                .replace(/mm/g, this.pad(month))
                .replace(/dd/g, this.pad(day.e))
                .replace(/nn/g, day.n)
                .replace(/{sep}/g, customSeparator);
        },
        convertDateToComparable(year, month, dayVal) {
            return Number(year) * 10000 + Number(month) * 100 + Number(dayVal);
        },
        findCurrentNepaliDate() {
            const today = new Date();
            const currentYearEnglish = today.getFullYear();
            const currentMonthEnglish = today.getMonth() + 1;
            const currentDayEnglish = today.getDate();
            for (const key in modules) {
                const mod = modules[key];
                if (!mod.metadata || !mod.metadata.en) continue;
                const meta = mod.metadata;
                const parts = meta.en.split(' ');
                if (parts.length < 2) continue;
                const monthPart = parts[0];
                const yearStr = parts[1];
                const metaYear = parseInt(yearStr, 10);
                if (metaYear !== currentYearEnglish) continue;
                const months = monthPart.split('/');
                if (months.length !== 2) continue;
                const firstEnglishMonth = this.monthNameToNumber(months[0]);
                const secondEnglishMonth = this.monthNameToNumber(months[1]);
                const daysArray = mod.days;
                let firstSegment = [];
                let secondSegment = [];
                let foundReset = false;
                for (const day of daysArray) {
                    if (!foundReset && day.e && day.e.trim() === "01") {
                        foundReset = true;
                    }
                    if (!foundReset) {
                        firstSegment.push(day);
                    } else {
                        secondSegment.push(day);
                    }
                }
                if (currentMonthEnglish === firstEnglishMonth) {
                    for (const day of firstSegment) {
                        if (day.e && parseInt(day.e, 10) === currentDayEnglish) {
                            const segments = key.split('/');
                            const nepaliYear = segments[0];
                            const nepaliMonth = segments[1];
                            return { nepaliYear, nepaliMonth, currentNepaliDay: day };
                        }
                    }
                }
                if (currentMonthEnglish === secondEnglishMonth) {
                    for (const day of secondSegment) {
                        if (day.e && parseInt(day.e, 10) === currentDayEnglish) {
                            const segments = key.split('/');
                            const nepaliYear = segments[0];
                            const nepaliMonth = segments[1];
                            return { nepaliYear, nepaliMonth, currentNepaliDay: day };
                        }
                    }
                }
            }
            return { nepaliYear: "2081", nepaliMonth: "12", currentNepaliDay: null };
        },
        chunkArray(array, size) {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        },
        toggleCalendar() {
            if (!this.calendarVisible && this.selectedDate) {
                this.currentYear = this.selectedDate.nepaliYear;
                this.currentMonth = this.selectedDate.nepaliMonth;
                this.loadCalendar();
            }
            this.calendarVisible = !this.calendarVisible;
        },
        getFormattedDate(formatStr, year, month, day) {
            if (formatStr && formatStr.trim() !== '') {
                return this.formatDate(formatStr, year, month, day, this.customSeparator);
            }
            if (this.data && this.data.metadata && this.data.metadata.np) {
                return `${day.n} (${this.data.metadata.np})`;
            }
            return `${day.n}`;
        },
        isToday(day) {
            if (!this.currentNepaliToday) return false;
            // Compare the module's year and month to today's computed year and month.
            if (this.currentYear !== this.computedTodayYear || this.currentMonth !== this.computedTodayMonth) {
                return false;
            }
            return String(day.n).trim() === String(this.currentNepaliToday.n).trim() &&
                String(day.e).trim() === String(this.currentNepaliToday.e).trim();
        },
        isSelected(day) {
            if (!this.selectedDate) return false;
            if (this.currentYear !== this.selectedDate.nepaliYear || this.currentMonth !== this.selectedDate.nepaliMonth) {
                return false;
            }
            return String(day.n).trim() === String(this.selectedDate.n).trim() &&
                String(day.e).trim() === String(this.selectedDate.e).trim();
        },
        isWithinRange(year, month, dayValue) {
            const currentVal = this.convertDateToComparable(year, month, dayValue);
            if (this.minDate) {
                const minVal = this.convertDateToComparable(
                    this.minDate.nepaliYear,
                    this.minDate.nepaliMonth,
                    this.minDate.day
                );
                if (currentVal < minVal) return false;
            }
            if (this.maxDate) {
                const maxVal = this.convertDateToComparable(
                    this.maxDate.nepaliYear,
                    this.maxDate.nepaliMonth,
                    this.maxDate.day
                );
                if (currentVal > maxVal) return false;
            }
            return true;
        },
        selectDay(day) {
            if (!this.isWithinRange(this.currentYear, this.currentMonth, day.e)) {
                console.warn('Selected date is out of range.');
                return;
            }
            this.selectedDate = { ...day, nepaliYear: this.currentYear, nepaliMonth: this.currentMonth };
            this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.currentYear, this.currentMonth, day);
            this.calendarVisible = false;
            let formattedReturn;
            if (typeof this.returnFormat === 'function') {
                formattedReturn = this.returnFormat(this.currentYear, this.currentMonth, day);
            } else if (this.returnFormat === 'detailed' || this.valueType === 'object') {
                formattedReturn = day;
            } else if (this.returnFormat === 'yyyy-mm-dd') {
                formattedReturn = `${this.currentYear}${this.customSeparator}${this.pad(this.currentMonth)}${this.customSeparator}${this.pad(day.e)}`;
            } else {
                formattedReturn = day;
            }
            if (this.valueType === 'string' && typeof formattedReturn !== 'string') {
                formattedReturn = String(formattedReturn);
            }
            this.$emit('date-selected', formattedReturn);
        },
        nextMonth() {
            let monthNum = parseInt(this.currentMonth);
            let yearNum = parseInt(this.currentYear);
            if (monthNum >= 12) {
                monthNum = 1;
                yearNum++;
            } else {
                monthNum++;
            }
            this.currentMonth = monthNum.toString();
            this.currentYear = yearNum.toString();
        },
        previousMonth() {
            let monthNum = parseInt(this.currentMonth);
            let yearNum = parseInt(this.currentYear);
            if (monthNum <= 1) {
                monthNum = 12;
                yearNum--;
            } else {
                monthNum--;
            }
            this.currentMonth = monthNum.toString();
            this.currentYear = yearNum.toString();
        },
        loadCalendar() {
            getNepaliDateData(this.currentYear, this.currentMonth)
                .then(monthData => {
                    this.data = monthData;
                    this.weeks = this.chunkArray(monthData.days, 7);
                    // If an initial day (string) was provided and no day is yet selected,
                    // find the matching day in the loaded month's data.
                    if (this.initialDayArabic && !this.selectedDate) {
                        const targetNepaliDay = this.convertToNepaliNumerals(this.initialDayArabic);
                        const found = monthData.days.find(day => String(day.n).trim() === targetNepaliDay);
                        if (found) {
                            this.selectedDate = { ...found, nepaliYear: this.currentYear, nepaliMonth: this.currentMonth };
                            this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.currentYear, this.currentMonth, found);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading data for', this.currentYear, this.currentMonth, error);
                    this.data = null;
                    this.weeks = [];
                });
        }
    },
    watch: {
        currentYear() {
            this.loadCalendar();
        },
        currentMonth() {
            this.loadCalendar();
        }
    },
    mounted() {
        const computedToday = this.findCurrentNepaliDate();
        this.computedTodayYear = computedToday.nepaliYear;
        this.computedTodayMonth = computedToday.nepaliMonth;
        this.currentNepaliToday = computedToday.currentNepaliDay;
        if (typeof this.initialDate === 'string') {
            const parts = this.initialDate.split('-');
            if (parts.length === 3) {
                this.currentYear = parts[0];
                this.currentMonth = String(Number(parts[1]));
                this.initialDayArabic = parts[2];
            } else {
                console.warn("initialDate string is not in the expected format yyyy-mm-dd");
                this.currentYear = computedToday.nepaliYear;
                this.currentMonth = computedToday.nepaliMonth;
            }
        } else if (this.initialDate && typeof this.initialDate === 'object') {
            this.selectedDate = this.initialDate.currentNepaliDay || null;
            this.currentYear = this.initialDate.nepaliYear;
            this.currentMonth = this.initialDate.nepaliMonth;
            if (this.selectedDate) {
                this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.initialDate.nepaliYear, this.initialDate.nepaliMonth, this.selectedDate);
            }
        } else {
            this.currentYear = computedToday.nepaliYear;
            this.currentMonth = computedToday.nepaliMonth;
        }
        this.loadCalendar();
    }
};
</script>

<style scoped>
.date-picker {
    position: relative;
    display: inline-block;
    font-family: sans-serif;
    color: var(--text-color, #333);
}

input {
    padding: 8px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-color, #333);
}

.calendar {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: #fff;
    border: 1px solid #ccc;
    z-index: 1000;
    width: fit-content;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: var(--accent-color, #3ba7ff);
    border-bottom: 1px solid #ccc;
}

.month-info {
    text-align: center;
}

.month-display {
    font-weight: bold;
    font-size: 1rem;
}

.english-range {
    font-size: 0.75rem;
    color: var(--text-color, #333);
}

.nav-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px 8px;
    color: var(--text-color, #333);
}

.calendar-body {
    padding: 8px;
}

table {
    width: 100%;
    table-layout: fixed;
}

th,
td {
    text-align: center;
    padding: 4px;
    border: 1px solid #eee;
    font-size: 0.9rem;
    width: 32px;
    height: 32px;
    overflow: hidden;
}

td.selectable:hover {
    background: #e0e0e0;
    cursor: pointer;
}

.selected {
    background: var(--primary-color, #3ba7ff);
}

.today {
    border: 2px solid var(--primary-color, #333);
}

.nepali-date {
    font-size: 1rem;
    font-weight: 500;
}

.english-date {
    font-size: 0.7rem;
    color: #777;
    margin-top: 2px;
}
</style>