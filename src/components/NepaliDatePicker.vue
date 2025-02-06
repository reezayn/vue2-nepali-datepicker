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
import { getNepaliDateData } from '../utils/dataLoader'

export default {
    name: 'NepaliDatePicker',
    props: {
        showEnglishDate: { type: Boolean, default: true },
        primaryColor: { type: String, default: "#fbc02d" },
        accentColor: { type: String, default: "#ffeb3b" },
        textColor: { type: String, default: "#333" },
        placeholder: { type: String, default: "Select a date" },
        initialDate: { type: [Object, String], default: null },
        minDate: { type: Object, default: null },
        maxDate: { type: Object, default: null },
        inputStyles: { type: Object, default: () => ({}) },
        returnFormat: { type: [String, Function], default: 'yyyy-mm-dd' },
        displayFormat: { type: String, default: '' },
        locale: { type: String, default: "en" },
        customSeparator: { type: String, default: "-" },
        valueType: { type: String, default: "string" }
    },
    data() {
        return {
            calendarVisible: false,
            selectedDate: null,
            selectedDateDisplay: '',
            data: null,
            weeks: [],
            currentYear: '',
            currentMonth: '',
            currentNepaliToday: null,
            initialDayArabic: null,
            computedTodayYear: '',
            computedTodayMonth: ''
        }
    },
    computed: {
        weekDays() {
            return this.locale === 'np'
                ? ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि']
                : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        },
        currentMonthDisplay() {
            return this.data && this.data.metadata && this.data.metadata.np
                ? this.data.metadata.np
                : `${this.currentMonth}/${this.currentYear}`;
        },
        inputComputedStyle() {
            return Object.assign({ width: "200px", border: "1px solid #ccc" }, this.inputStyles);
        }
    },
    methods: {
        convertToNepaliNumerals(arabicStr) {
            const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
            return arabicStr.split('').map(ch => map[ch]).join('');
        },
        convertNepaliToArabic(nepaliStr) {
            const map = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
            return nepaliStr.split('').map(ch => map[ch] || ch).join('');
        },
        monthNameToNumber(name) {
            const map = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
            return map[name];
        },
        pad(value) {
            const str = String(value);
            return str.length < 2 ? '0' + str : str;
        },
        formatDate(format, year, month, day, customSeparator) {
            return format
                .replace(/yyyy/g, year)
                .replace(/mm/g, this.pad(month))
                .replace(/dd/g, this.convertNepaliToArabic(this.pad(day.n)))
                .replace(/nn/g, day.n)
                .replace(/{sep}/g, customSeparator);
        },
        convertDateToComparable(year, month, dayVal) {
            return Number(year) * 10000 + Number(month) * 100 + Number(dayVal);
        },
        async computeTodayNepaliDate() {
            const today = new Date();
            const currentEnglishYear = today.getFullYear();
            const currentEnglishDay = today.getDate();
            const currentEnglishMonth = today.toLocaleString('en', { month: 'short' });
            // Estimate Nepali year from AD (typical offset ~57)
            const estimatedNepYear = today.getFullYear() + 57;
            // Search in a range: estimatedNepYear-2 to estimatedNepYear+2
            for (let yOffset = -2; yOffset <= 2; yOffset++) {
                const nepYear = String(estimatedNepYear + yOffset);
                for (let m = 1; m <= 12; m++) {
                    try {
                        const monthData = await getNepaliDateData(nepYear, String(m));
                        if (monthData.metadata && monthData.metadata.en && monthData.metadata.en.includes(currentEnglishYear) &&
                            monthData.metadata.en.toLowerCase().includes(currentEnglishMonth.toLowerCase())) {
                            const found = monthData.days.find(day => parseInt(day.e, 10) === currentEnglishDay);
                            if (found) {
                                return { nepaliYear: nepYear, nepaliMonth: String(m), currentNepaliDay: found };
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }
            // return { nepaliYear: "2081", nepaliMonth: "12", currentNepaliDay: null };
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
            if (!this.isWithinRange(this.currentYear, this.currentMonth, day.e)) return;
            this.selectedDate = { ...day, nepaliYear: this.currentYear, nepaliMonth: this.currentMonth };
            this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.currentYear, this.currentMonth, day);
            this.calendarVisible = false;
            let formattedReturn;
            if (typeof this.returnFormat === 'function') {
                formattedReturn = this.returnFormat(this.currentYear, this.currentMonth, day);
            } else if (this.returnFormat === 'detailed' || this.valueType === 'object') {
                formattedReturn = day;
            } else if (this.returnFormat === 'yyyy-mm-dd') {
                formattedReturn = `${this.currentYear}${this.customSeparator}${this.pad(this.currentMonth)}${this.customSeparator}${this.convertNepaliToArabic(this.pad(day.n))}`;
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
            if (monthNum >= 12) { monthNum = 1; yearNum++; } else { monthNum++; }
            this.currentMonth = monthNum.toString();
            this.currentYear = yearNum.toString();
        },
        previousMonth() {
            let monthNum = parseInt(this.currentMonth);
            let yearNum = parseInt(this.currentYear);
            if (monthNum <= 1) { monthNum = 12; yearNum--; } else { monthNum--; }
            this.currentMonth = monthNum.toString();
            this.currentYear = yearNum.toString();
        },
        loadCalendar() {
            getNepaliDateData(this.currentYear, this.currentMonth)
                .then(monthData => {
                    this.data = monthData;
                    this.weeks = this.chunkArray(monthData.days, 7);
                    if (this.initialDayArabic && !this.selectedDate) {
                        const targetNepaliDay = this.convertToNepaliNumerals(this.initialDayArabic);
                        const found = monthData.days.find(day => String(day.n).trim() === targetNepaliDay);
                        if (found) {
                            this.selectedDate = { ...found, nepaliYear: this.currentYear, nepaliMonth: this.currentMonth };
                            this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.currentYear, this.currentMonth, found);
                        }
                    }
                })
                .catch(() => {
                    this.data = null;
                    this.weeks = [];
                });
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.calendarVisible = false;
            }
        }
    },
    watch: {
        currentYear() { this.loadCalendar(); },
        currentMonth() { this.loadCalendar(); }
    },
    async mounted() {
        document.addEventListener('click', this.handleClickOutside);

        const todayNepali = await this.computeTodayNepaliDate();
        this.computedTodayYear = todayNepali.nepaliYear;
        this.computedTodayMonth = todayNepali.nepaliMonth;
        this.currentNepaliToday = todayNepali.currentNepaliDay;
        if (typeof this.initialDate === 'string') {
            const parts = this.initialDate.split('-');
            if (parts.length === 3) {
                this.currentYear = parts[0];
                this.currentMonth = String(Number(parts[1]));
                this.initialDayArabic = parts[2];
            } else {
                this.currentYear = this.computedTodayYear;
                this.currentMonth = this.computedTodayMonth;
            }
        } else if (this.initialDate && typeof this.initialDate === 'object') {
            this.selectedDate = this.initialDate.currentNepaliDay || null;
            this.currentYear = this.initialDate.nepaliYear;
            this.currentMonth = this.initialDate.nepaliMonth;
            if (this.selectedDate) {
                this.selectedDateDisplay = this.getFormattedDate(this.displayFormat, this.initialDate.nepaliYear, this.initialDate.nepaliMonth, this.selectedDate);
            }
        } else {
            this.currentYear = this.computedTodayYear;
            this.currentMonth = this.computedTodayMonth;
        }
        this.loadCalendar();
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
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