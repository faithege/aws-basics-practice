<template>
  <div>
    <b-form inline @submit="onSubmit">
      <b-form-group
        id="input-group-id" label="Name:" label-for="input-name"
      >
        <b-form-input
          id="input-1"
          v-model="id"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-step" label="Step:" label-for="input-step">
        <b-form-input
          id="input-step"
          v-model="step"
          placeholder="Enter number"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
      return {
        id: null,
        step: null
      }
    },
    methods: {
      onSubmit(event) {
        event.preventDefault()
        alert("Hello World")
      }
    }
}
</script>

