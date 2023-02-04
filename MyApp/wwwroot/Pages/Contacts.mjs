import { ref, onMounted, watch } from "vue"
import { useClient, useMetadata } from "@servicestack/vue"
import { GetContacts, CreateContact, UpdateContact, DeleteContact } from "../mjs/dtos.mjs"

const Create = {
    template:/*html*/`<SlideOver @done="close" title="New Contact">
    <form ref="form" @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary except="title,name,color,favoriteGenre,age,agree" class="mb-4" />
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
          <div class="col-span-6 sm:col-span-3 flex items-center">
            <CheckboxInput id="agree" v-model="request.agree" label="Agree to terms and conditions" />
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

        const client = useClient()
        const request = ref(new CreateContact())

        const { property, propertyOptions, enumOptions } = useMetadata()
        const colorOptions = propertyOptions(property('CreateContact','Color'))
        
        async function submit() {
            const api = await client.api(request.value)
            if (api.succeeded) close()
        }
        const close = () => emit('done')
        return { submit, close, enumOptions, colorOptions, request }
    }
}

const Edit = {
    template:/*html*/`<SlideOver @done="close" title="Edit Contact">
    <form ref="form" @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary except="title,name,color,favoriteGenre,age" class="mb-4" />
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
        const client = useClient()

        const request = ref(new UpdateContact(props.contact))
        const { property, propertyOptions, enumOptions } = useMetadata()
        const colorOptions = propertyOptions(property('UpdateContact','Color'))

        async function submit() {
            const api = await client.api(request.value)
            if (api.succeeded) close()
        }
        async function onDelete() {
            const api = await client.apiVoid(new DeleteContact({ id:props.contact.id }))
            if (api.succeeded) close()
        }
        const close = () => emit('done')
        return { colorOptions, request, submit, close, enumOptions, onDelete }
    }
}

export default {
    components: { Create, Edit },
    template:/*html*/`<div>
    <OutlineButton @click="reset({create:true})">
      <svg class="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path></svg>
      New Contact
    </OutlineButton>
    <Create v-if="create" @done="done" />
    <Edit v-else-if="edit" :contact="edit" @done="done" />
    <DataGrid v-if="results.length > 0" :items="results" :selected-columns="['id','name','title','favoriteGenre','age']"
        :row-style="(row,index) => editId == row.id ? null : ({ backgroundColor:row.color })"
        @row-selected="editId = editId == $event.id ? null : $event.id" :is-selected="row => editId == row.id" >
    </DataGrid>
  </div>`,
    props:['contacts'],
    setup(props) {
        const create = ref(false)
        const edit = ref()
        const editId = ref()
        const results = ref(props.contacts || [])

        const client = useClient()

        async function refresh() {
            const api = await client.api(new GetContacts())
            if (api.succeeded) {
                results.value = api.response.results || []
            }
        }

        onMounted(async () => await refresh())

        /** @param {{ create?: boolean, editId?:number }} [args] */
        function reset(args={}) {
            create.value = args.create || false
            editId.value = args.editId
        }

        async function done() {
            reset()
            await refresh()
        }

        watch(editId, async () => {
            if (editId.value) {
                const api = await client.api(new GetContacts({ id: editId.value }))
                if (api.succeeded) {
                    edit.value = api.response.results[0]
                    return
                }
            }
            edit.value = null
        })

        return { create, edit, editId, results, reset, done }
    }
}
