<template>
    <div id="app">
        <h1>Vue Nepali Date Picker Demo</h1>

        <!-- Example 1: Return Format "yyyy-mm-dd" (String) -->
        <section class="example">
            <h2>Example 1: Return Format "yyyy-mm-dd" (String)</h2>
            <p>
                Returns the selected date as a string in "yyyy-mm-dd" format (default display, English locale).
            </p>
            <NepaliDatePicker :showEnglishDate="true" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Pick a Nepali Date"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
                returnFormat="yyyy-mm-dd" valueType="string" @date-selected="handleDateSelectedFormatted" />
            <pre class="output">{{ outputFormatted }}</pre>
        </section>

        <!-- Example 2: Return Format "detailed" (Object) -->
        <section class="example">
            <h2>Example 2: Return Format "detailed" (Object)</h2>
            <p>
                Returns the full day object for detailed processing.
            </p>
            <NepaliDatePicker :showEnglishDate="true" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Pick a Nepali Date (Detailed)"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }" returnFormat="detailed"
                valueType="object" @date-selected="handleDateSelectedDetailed" />
            <pre class="output">{{ outputDetailed }}</pre>
        </section>

        <!-- Example 3: Custom Return Format (Function) -->
        <section class="example">
            <h2>Example 3: Custom Return Format (Function)</h2>
            <p>
                Uses a custom function to return a formatted string.
            </p>
            <NepaliDatePicker :showEnglishDate="true" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Pick a Nepali Date (Custom Format)"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
                :returnFormat="myCustomReturnFormat" valueType="string" @date-selected="handleDateSelectedCustom" />
            <pre class="output">{{ outputCustom }}</pre>
        </section>

        <!-- Example 4: Custom Display Format and Locale "np" -->
        <section class="example">
            <h2>Example 4: Custom Display Format and Locale "np"</h2>
            <p>
                Uses a custom display format ("yyyy{sep}mm{sep}dd") with a custom separator. Weekdays appear in English.
            </p>
            <NepaliDatePicker :showEnglishDate="false" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Custom Display Format"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
                returnFormat="yyyy-mm-dd" displayFormat="yyyy{sep}mm{sep}dd" customSeparator="/" locale="en"
                valueType="string" @date-selected="handleDateSelectedDisplayFormat" />
            <pre class="output">{{ outputDisplayFormat }}</pre>
        </section>

        <!-- Example 5: Using minDate and maxDate (Restricted Range) -->
        <section class="example">
            <h2>Example 5: Using minDate and maxDate (Restricted Range)</h2>
            <p>
                Restricts selectable dates between the specified minDate and maxDate.
            </p>
            <NepaliDatePicker :showEnglishDate="true" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Restricted Date Range"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
                returnFormat="yyyy-mm-dd" valueType="string" :minDate="{ nepaliYear: '2070', nepaliMonth: '1', day: 1 }"
                :maxDate="{ nepaliYear: '2090', nepaliMonth: '12', day: 31 }"
                @date-selected="handleDateSelectedRestricted" />
            <pre class="output">{{ outputRestricted }}</pre>
        </section>

        <!-- Example 6: Using Initial Date (Preselect and Initialize) -->
        <section class="example">
            <h2>Example 6: Using Initial Date (Preselect and Initialize)</h2>
            <p>
                Initializes the date picker with a provided initial date string (format "yyyy-mm-dd").
            </p>
            <NepaliDatePicker :showEnglishDate="true" primaryColor="#60B7F0" accentColor="#60B7F0" textColor="#212121"
                placeholder="Initial Date Example"
                :inputStyles="{ width: '300px', border: '2px solid #ccc', borderRadius: '8px' }"
                returnFormat="yyyy-mm-dd" valueType="string" :initialDate="initialDemoDate"
                @date-selected="handleDateSelectedInitial" />
            <pre class="output">{{ outputInitial }}</pre>
        </section>

        <div class="footer">Made by <a href="https://rijanshrestha.com.np" target="_blank">Rijan Shrestha</a></div>
    </div>
</template>

<script>
import { NepaliDatePicker } from '../../src/index.js';

export default {
    name: 'App',
    components: { NepaliDatePicker },
    data() {
        return {
            initialDemoDate: '2085-10-25',
            outputFormatted: '',
            outputDetailed: '',
            outputCustom: '',
            outputDisplayFormat: '',
            outputRestricted: '',
            outputInitial: ''
        };
    },
    methods: {
        handleDateSelectedFormatted(date) {
            this.outputFormatted = date;
            console.log('Example 1:', date);
        },
        handleDateSelectedDetailed(date) {
            this.outputDetailed = JSON.stringify(date, null, 2);
            console.log('Example 2:', date);
        },
        handleDateSelectedCustom(date) {
            this.outputCustom = date;
            console.log('Example 3:', date);
        },
        handleDateSelectedDisplayFormat(date) {
            this.outputDisplayFormat = date;
            console.log('Example 4:', date);
        },
        handleDateSelectedRestricted(date) {
            this.outputRestricted = date;
            console.log('Example 5:', date);
        },
        handleDateSelectedInitial(date) {
            this.outputInitial = date;
            console.log('Example 6:', date);
        },
        myCustomReturnFormat(year, month, day) {
            return `Nepali: ${day.n} of ${month}/${year}`;
        }
    }
};
</script>

<style scoped>
#app {
    padding: 20px;
    font-family: sans-serif;
    max-width: 800px;
    margin: 0 auto;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.example {
    margin-bottom: 40px;
    padding: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
}

.example h2 {
    margin-top: 0;
    color: #333;
}

.example p {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 10px;
}

.output {
    background: #eee;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    margin-top: 10px;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
}

.footer a {
    color: #333;
}
</style>