import { ref, computed } from "vue"
import ShellCommand from "./components/ShellCommand.mjs"

export default {
    components: {
        ShellCommand,
    },
    template:/*html*/`
    <div class="flex flex-col w-96">
        <h4 class="py-6 text-center text-xl">Create New Project</h4>

      <input type="text" v-model="project" autocomplete="off" spellcheck="false" @keydown="validateSafeName"
             class="mb-8 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:bg-gray-800"/>

        <section class="w-full flex justify-center text-center">
           <div class="mb-2">
              <div class="flex justify-center text-center">
                 <a class="archive-url hover:no-underline netcoretemplates_empty" :href="zipUrl('NetCoreTemplates/' + template)">
                    <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600 dark:border-2 dark:border-pink-600 dark:hover:border-blue-600" style="min-width:150px">
                       <div class="text-center font-extrabold flex items-center justify-center mb-2">
                          <div class="text-4xl text-blue-400 my-3">
                            <svg class="w-14 h-14 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M10 6c1.544 1.76 2.276 4.15 2.217 6.61c3.968 1.67 9.924 6.12 11.181 12.39H28C26.051 14.31 14.918 6.77 10 6zm-2 7c4.67 4.913.81 11.582-4 12h18.97C21.5 18.289 11.95 13.533 8 13z"></path></svg>
                        </div>
                       </div>
                       <div class="text-xl font-medium text-gray-700">{{template}}</div>
                       <div class="flex justify-center h-8"></div>
                       <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                       <div class="count mt-1 text-gray-400 text-sm"></div>
                    </div>
                 </a>
              </div>
           </div>
        </section>

      <ShellCommand class="mb-2">dotnet tool install -g x</ShellCommand>
      <ShellCommand class="mb-2">x new {{template}} {{project}}</ShellCommand>

      <h4 class="py-6 text-center text-xl">In <span class="font-semibold text-indigo-700">/MyApp</span>, Run Tailwind</h4>
      <ShellCommand class="mb-2">npm run ui:dev</ShellCommand>

      <h4 class="py-6 text-center text-xl">Run .NET Project (New Terminal)</h4>
      <ShellCommand class="mb-2">dotnet watch</ShellCommand>

    </div>`,
    props: { template:String },
    setup(props) {
        const project = ref('ProjectName')

        const projectZip = computed(() => (project.value || 'MyApp') + '.zip')

        /** @param {string} template */
        const zipUrl = (template) =>
            `https://account.servicestack.net/archive/${template}?Name=${project.value || 'MyApp'}`

        /** @param {KeyboardEvent} e */
        const isAlphaNumeric = (e) => {
            const c = e.charCode;
            if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 95) //A-Za-z0-9_
                return;
            e.preventDefault()
        }

        /** @param path {string}
         * @returns {string} */
        const resolvePath = (path) => navigator.userAgent.indexOf("Win") >= 0 ? path.replace(/\//g,'\\') : path
        const uiPath = () => resolvePath(`ui`)
        const apiPath = () => resolvePath(`api/${project.value}`)

        /** @param e {KeyboardEvent} */
        function validateSafeName(e) {
            if (e.key.match(/[\W]+/g)) {
                e.preventDefault()
                return false
            }
        }
        return { project, projectZip, zipUrl, isAlphaNumeric, uiPath, apiPath, validateSafeName }
    }
}