import { ref, onMounted } from "vue"
import { GetContacts, CreateContact, UpdateContact, DeleteContact } from "../mjs/dtos.mjs"
import { useClient, useAppMetadata } from "@servicestack/vue"

const Create = {
    template:/*html*/`<SlideOver @done="close" title="New Contact">
    <form @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary :except="visibleFields" class="mb-4" />
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="title" v-model="title" :options="enumOptions('Title')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput id="name" v-model="name" required placeholder="Contact Name" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="color" v-model="color" :options="colorOptions" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="favoriteGenre" v-model="favoriteGenre" :options="enumOptions('FilmGenre')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="number" id="age" v-model="age" />
          </div>
          <div class="col-span-6 sm:col-span-3 flex items-center">
            <CheckboxInput id="agree" v-model="agree" label="Agree to terms and conditions" />
          </div>
        </div>
      </fieldset>
    </form>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <PrimaryButton @click="submit">Create Contact</PrimaryButton>
      </div>
    </template>
  </SlideOver>`,
    emits:['done'],
    setup(props, { emit }) {
        const visibleFields = "title,name,color,filmGenres,age,agree"
        const client = useClient()
        const { unRefs } = client

        const title = ref('')
        const name = ref('')
        const color = ref('')
        const favoriteGenre = ref('')
        const age = ref(0)
        const agree = ref(false)

        const { property, propertyOptions, enumOptions } = useAppMetadata()
        const colorOptions = propertyOptions(property('CreateContact','Color'))
        
        async function submit() {
            const api = await client.api(new CreateContact(unRefs({ title, name, color, favoriteGenre, age, agree })))
            if (api.succeeded) close()
        }
        const close = () => emit('done')
        return { visibleFields, submit, close, enumOptions, colorOptions, title, name, color, favoriteGenre, age, agree }
    }
}

const Edit = {
    template:/*html*/`<SlideOver @done="close" title="Edit Contact">
    <form @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary :except="visibleFields" class="mb-4" />
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="title" v-model="request.title" :options="enumOptions('Title')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput id="name" v-model="request.name" required placeholder="Contact Name" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="color" v-model="request.color" :options="colorOptions" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="favoriteGenre" v-model="request.favoriteGenre" :options="enumOptions('FilmGenre')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="number" id="age" v-model="request.age" />
          </div>
        </div>
      </fieldset>
    </form>
    <template #footer>
      <div class="flex justify-between space-x-3">
        <div><ConfirmDelete @delete="onDelete">Delete</ConfirmDelete></div>
        <div><PrimaryButton @click="submit">Update Contact</PrimaryButton></div>
      </div>
    </template>
  </SlideOver>`,
    props:['contact'],
    emits:['done'],
    setup(props, { emit }) {
        const visibleFields = "title,name,color,filmGenres,age,agree"
        const client = useClient()

        const request = ref(new UpdateContact(props.contact))
        const { property, propertyOptions, enumOptions } = useAppMetadata()
        const colorOptions = propertyOptions(property('CreateContact','Color'))

        /** @param {Event} e */
        async function submit(e) {
            const api = await client.api(request.value)
            if (api.succeeded) close()
        }
        async function onDelete() {
            const api = await client.apiVoid(new DeleteContact({id: props.contact.id}))
            if (api.succeeded) close()
        }
        const close = () => emit('done')
        return { visibleFields, colorOptions, request, submit, close, enumOptions, onDelete }
    }
}

export default {
    components: { Create, Edit },
    template:/*html*/`<div>
    <OutlineButton @click="() => reset({newContact:true})">
      <svg class="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path></svg>
      New Contact
    </OutlineButton>
    <Create v-if="newContact" @done="onDone" />
    <Edit v-else-if="edit" :contact="edit" @done="onDone" />
    <div v-if="results.length > 0" class="mt-4 flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
              <tr class="select-none">
                <th scope="col" :class="css.th">Id</th>
                <th scope="col" :class="css.th">Title</th>
                <th scope="col" :class="css.th">Name</th>
                <th scope="col" :class="css.th">Genre</th>
                <th scope="col" :class="css.th">Age</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(contact, index) in results" :key="contact.id" @click="edit = edit == contact ? null : contact" 
                  :class="[edit && edit.id == contact.id ? css.trActive : css.tr]" :style="edit && edit.id == contact.id ? '' : 'background-color:'+contact.color">
                <td :class="css.td">
                  {{ contact.id }}
                </td>
                <td :class="css.td">
                  {{ contact.title }}
                </td>
                <td :class="css.td">
                  {{ contact.name }}
                </td>
                <td :class="css.td">
                  {{ contact.favoriteGenre }}
                </td>
                <td :class="css.td">
                  {{ contact.age }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    props:['contacts'],
    setup(props) {
        const css = {
            trActive:'cursor-pointer bg-indigo-100 dark:bg-blue-800',
            tr:'cursor-pointer hover:bg-yellow-50 dark:hover:bg-blue-900',
            th:'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
            td:'px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400',
        }

        const newContact = ref(false)
        const edit = ref()
        const results = ref(props.contacts || [])

        const { api } = useClient()

        async function refresh() {
            const r = await api(new GetContacts())
            if (r.succeeded) {
                results.value = r.response.results || []
            }
        }

        onMounted(async () => await refresh())

        /** @param {{ newBooking?: boolean, editId?:number }} [args] */
        function reset(args={}) {
            newContact.value = args.newContact || false
            edit.value = undefined
        }

        async function onDone() {
            console.log('onDone')
            reset()
            await refresh()
        }

        return {
            css, newContact, edit, results, reset, onDone
        }
    }
}
