<template>
  <h5 class="d-none"></h5>
  <form ref="ShAutoForm" class="sh-form">
    <div class="alert alert-danger alert-dismissible fade show  sh-form-submission-error" v-if="form_status == 3" role="alert">
      <i class="bi-exclamation-triangle-fill me-1"></i>
        <span v-if="errorText">{{ errorText }}</span>
    </div>
    <input type="hidden" v-model="form_elements['id']">
    <div class="row">
    <div class="form-group" v-for="field in fields" :class="'col-md-' + getColumns()" :key="field">
      <label class="fg-label control-label text-capitalize control-bel col-md-12 request-form-label mb-2">{{ getLabel(field) }}</label>
       <div class="col-md-12">
         <component :is="customComponent[field]" :data-cy="field" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'component'" class="form-control"/>
         <input :data-cy="field" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" :ref="'file_'+field" v-on:change="handleFileUpload(field)" v-if="getFieldType(field) === 'file'" type="file" class="form-control">
         <input :data-cy="field" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'numeric'" type="number" class="form-control">
         <input :data-cy="field" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'password'" type="password" class="form-control">
         <input :data-cy="field" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'email'" type="email" required class="form-control">
         <input :data-cy="field" type="datetime-local" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'datepicker' && isDisabled(field) === false" class="form-control active">
         <phone-input :country_code="country_code" :placeholder="allPlaceHolders[field] ? allPlaceHolders[field] : ''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'phone'" required class="form-control"/>
         <ShSuggest :select-data="selectData[field]" :fill-selects="fillSelects[field]" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'suggest'"/>
         <input :disabled="isDisabled(field)" :placeholder="field === 'phone_number' ? 'e.g 0712 345 678':''" :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'text'" type="text" class="form-control">
         <textarea :name="field" @focus="removeErrors(field)" :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field" v-model="form_elements[field]" v-if="getFieldType(field) === 'textarea'" class="form-control"></textarea>
         <select :name="field" @focus="removeErrors(field)"
                 :class="form_errors[field] == null ? ' field_' + field:'is-invalid ' + field"
                 v-model="form_elements[field]"
                 v-if="getFieldType(field) === 'select'"
                 class="form-select" aria-label="Default select example">
           <option v-for="(item,index) in selectData[field]" :key="item.id" :value="item.id" :selected="index === 0 ? true : false">{{item.name}} </option>
         </select>
         <div v-if="form_errors[field] != null " class="invalid-feedback">
           {{ form_errors[field][0]  }}
         </div>
       </div>
    </div>
    </div>
    <div class="row" v-if="hasTerms">
      <h5>Confirm and Submit</h5>
      <p>By clicking submit, you agree to our <a target="_blank" href="/">terms and conditions</a> and that you have read our <a target="_blank" href="https://hauzisha.co.ke/privacy-policy">privacy policy</a></p>
    </div>
    <button class="btn btn-primary" v-if="form_status == 1" type="button" :class="getSubmitBtnClass()" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Processing...
    </button>
    <button v-else data-cy="sh_form_submit" class="mb-2 form-submit-btn" :class="getSubmitBtnClass()"  type="button" @click="submitForm">
      {{ actionLabel ? actionLabel:'Submit'}}
    </button>
  </form>
</template>
<script>
import apis from '@/helpers/ShApis.js'
import NProgress from 'nprogress'
import ShPhone from './form-components/PhoneInput.vue'
import ShSuggest from './form-components/ShSuggest.vue'
import shRepo from '@/helpers/ShRepo.js'
import PhoneInput from './form-components/PhoneInput.vue'
export default {
  name: 'ShForm',
  components: {
    PhoneInput,
    ShSuggest,
    ShPhone
  },
  props: [
      'hiddenFields',
      'methods',
      'action',
    'classes',
    'hasTerms',
    'country_code',
    'submitBtnClass',
      'retainModal',
    'fields',
    'columns', 'placeholders', 'field_permissions', 'retainDataAfterSubmission',
    'currentData', 'actionLabel', 'fillSelects', 'phones', 'successCallback',
    'failedCallback', 'labels', 'editors',
    'datePickers',
      'textAreas',
      'files',
      'phones',
      'numbers',
      'customComponent',
      'successMessage'
  ],
  data: function () {
    return {
      form_elements: {},
      errorStatusCode: 0,
      errorText: null,
      form_errors: {},
      form_status: 0,
      error_res: null,
      form_files: {},
      exiting_fields: [],
      hideField: [],
      selectData: {},
      users: [],
      allPlaceHolders: {},
      user: null,
      putField: 'PUT',
      allLabels: {},
      suggests: []
    }
  },
  methods: {
    getSubmitBtnClass: function () {
      const btnClass = this.submitBtnClass
      if (!btnClass) {
        return 'btn btn-primary mt-2'
      } else {
        return btnClass
      }
    },
    getColumns: function () {
      let cols = parseFloat(this.columns)
      if (!cols) {
        cols = 1
      }
      const allowedColumns = [1, 2, 3, 4, 6, 12]
      if (!allowedColumns.includes(cols)) {
        return '12'
      } else {
        return 12 / parseFloat(cols)
      }
    },
    getFieldType: function (field) {
      if(this.customComponent && this.customComponent[field]){
        return 'component'
      }
      if(this.suggests && this.suggests.includes(field)){
        return 'suggest'
      }
      if(this.editors && this.editors.includes(field)){
        return 'editor'
      }
      if(this.textAreas && this.textAreas.includes(field)){
        return 'textarea'
      }
      if(this.datePickers && this.datePickers.includes(field)){
        return 'datepicker'
      }
      if(this.numbers && this.numbers.includes(field)){
        return 'numeric'
      }
      if(this.files && this.files.includes(field)){
        return 'file'
      }
      if(this.fillSelects && this.fillSelects[field]){
        return 'select';
      }
      const textareas = ['message', 'meta_description', 'comment', 'call_response', 'comments', 'description']
      const selects = ['gender', 'payment_method', 'allow_view_mode', 'reasons_name', 'has_free_tier', 'payment_period', 'role', 'register_as', 'account_type']
      const numbers = ['age']
      const datePickers = ['free_tier_days', 'recurring_date', 'date', 'dob']
      let realEditors = ['html_content', 'listing_description', 'mail', 'comment']
      const mapLocations = ['building_location']
      const files = ['file', 'logo']
      const phones = ['phone']
      if (this.selectData[field]) {
        return 'select'
      }
      if (field === 'email') {
        return 'email'
      }
      if (field.includes('password')) {
        return 'password'
      }
      if (textareas.includes(field)) {
        return 'textarea'
      }
      if (phones.includes(field)) {
        return 'phone'
      }
      if (mapLocations.includes(field)) {
        return 'location'
      }
      if (realEditors.includes(field)) {
        return 'editor'
      }
      if (numbers.includes(field)) {
        // alert('found')
        return 'numeric'
      }
      if (datePickers.includes(field)) {
        return 'datepicker'
      }
      if (selects.includes(field)) {
        return 'select'
      }
      if (typeof this.files === 'array' && this.files.includes(field)) {
        return 'file'
      }
      return 'text'
    },
    getLabel: function (field) {
      if (field in this.allLabels) {
        return this.allLabels[field]
      } else {
        return field.replace(/_/g, ' ')
      }
    },
    isDisabled: function (field) {
      if (typeof this.field_permissions === 'undefined') {
        return false
      }
      if (typeof this.user.isAllowedTo !== 'undefined') {
        return !this.user.isAllowedTo(this.field_permissions[field])
      }
      return true
    },
    validateEssentials: function () {
      if (this.fields.includes('password_confirmation')) {
        if (!this.form_elements.password) {
          this.form_errors = {
            password: ['Password field is required']
          }
          return false
        } else
        if (this.form_elements.password !== this.form_elements.password_confirmation) {
          this.form_errors = {
            password: ['Password confirmation does not match']
          }
          return false
        }
      }
    },
    hideError: function (){
      this.form_status = 0
    },
    closeModal: function () {
      document.body.style = ''
      setTimeout(() => {
        const form = this.$refs.ShAutoForm
        if(form){
          const modal = form.closest('.modal-dialog');
          if(modal){
            const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]')
            closeBtn && closeBtn.click()
          }
        } else {
          //form was mysteriously unmounted! try remove any modal backdrop if possible
          const modalBackdrop = document.querySelector('.modal-backdrop')
          if(modalBackdrop) {
            if(!document.querySelector('.modal.show')){
              modalBackdrop.remove()
            }
          }
        }
        this.form_status = 0
      }, 1500)
    },
    submitForm: async function () {
      this.errorText = null
      // return false;
      // if (!this.validateEssentials()) {
      //   return false
      // }
      NProgress.start()
      this.form_status = 1
      const data = new FormData()
      Object.keys(this.form_elements).forEach(key => {
        if (typeof this.form_elements[key] === 'object') {
          data.append(key, JSON.stringify(this.form_elements[key]))
        } else if (typeof this.form_elements[key] !== 'undefined') { data.append(key, this.form_elements[key]) }
      })
      Object.keys(this.form_files).forEach(key => {
        data.append(key, this.form_files[key].value)
      })
      const method = this.methods =='put' ? apis.doPut : apis.doPost;
      method(this.action, data).then(res => {
        this.form_status = 2
        Object.keys(this.form_elements).forEach(key => {
          this.form_errors[key] = null
          if (!this.retainDataAfterSubmission) {
            this.form_elements[key] = ''
          }
        })
        Object.keys(this.form_files).forEach(key => {
          this.form_errors[key] = null
        })
        this.$emit('formSubmitted',res.data)
        this.$emit('success',res.data)
        if(this.successMessage){
          shRepo.showToast(this.successMessage)
        }
        if (this.successCallback) {
          if (typeof this.successCallback === 'function') {
            this.successCallback(res.data)
          } else {
            this.$emit(this.successCallback, res.data)
          }
        }
        NProgress.done()
        if (!this.retainModal) {
          this.closeModal()
        }
      }).catch((reason, data) => {
        NProgress.done()
        if (typeof reason !== 'undefined') {
          if (typeof reason.response !== 'undefined') {
            this.form_status = 3
            this.setErrors(reason.response, reason.message)
          }
        }
      })
      return false
    },
    removeErrors: function (field) {
      this.form_errors[field] = null
      this.form_status = 0
    },
    setErrors: function (reason, message) {
      console.log(reason,message)
      if (reason.status === 422) { // change this to 422 validation error response as received from laravel
        this.form_errors = reason.data.errors
        this.errorText = 'Fill all the details correctly'
      } else {
        this.errorText = message
      }
    },
    handleFileUpload: function (key) {
      this.form_files[key].value = event.target.files[0]
    },
    setCurrentData: function () {
      this.exiting_fields = []
      if (this.currentData) {
        this.exiting_fields = this.currentData
      }
      this.form_elements.id = this.exiting_fields.id
      this.fields.forEach(field => {
        if (this.getFieldType(field) === 'file') {
          this.form_files[field] = { key: 'file', value: null }
        } else {
          if (this.exiting_fields[field] !== null) {
            this.form_elements[field] = this.exiting_fields[field]
          } else {
            this.form_elements[field] = ''
          }
        }
        this.form_errors[field] = null
      })
    },
    setHiddenFields: function () {
      if (this.hiddenFields) {
        for (let i = 0; i < this.hiddenFields.length; i++) {
          const fieldName = this.hiddenFields[i].name;
          const fieldValue = this.hiddenFields[i].value;
          if (fieldName == '_method' && fieldValue == 'PUT') {
            this.form_elements[fieldName] = this.putField;
          }
          this.form_elements[fieldName] = fieldValue;
        }
      }
    }
  },
  mounted: async function () {
    const selectData = {}
    if (this.fillSelects) {
      Object.keys(this.fillSelects).forEach(key => {
        if(this.fillSelects[key].suggest || this.fillSelects[key].suggests) {
          if (!this.suggests) {
            this.suggests = []
          }
          this.suggests.push(key)
        } else if (this.fillSelects[key].data) {
          this.selectData[key] = this.fillSelects[key].data
          console.log(this.selectData[key])
        } else {
          apis.doGet(this.fillSelects[key].url, { all: 1 }).then(res => {
            this.selectData[key] = res.data
          }).catch(res => {
            console.log(res)
          })
        }
      })
      console.log(selectData)
    }
  },
  created: function () {
    if (this.labels) {
      this.allLabels = this.labels
    }
    if (this.placeholders) {
      this.allPlaceHolders = this.placeholders
    }
    this.setHiddenFields()
    this.setCurrentData()

  },
  watch: {
    hiddenFields :function () {
      this.setHiddenFields()
    },
    currentData: function () {
      this.setCurrentData()
    }
  }
}
</script>
