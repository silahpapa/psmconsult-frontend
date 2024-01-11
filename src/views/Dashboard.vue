<script setup>
import shApis from '@/helpers/ShApis.js'
import shRepo from '@/helpers/ShRepo.js'
import {onBeforeMount, ref} from 'vue'
let alladmin = ref(0)
let allMembers = ref(0)

const fetchSummary = (range) => {
}
onBeforeMount(()=>{
})

</script>
<template>
    <div class="row p-3 bg-white">
      <div class="col-xl-6 col-lg-6">
        <div v-if="allMembers >= 0" class="card l-bg-cherry">
          <div class="card-statistic-3 p-2">
            <div class="card-icon card-icon-large"><i class="fas fa-shopping-car"></i></div>
            <div class="mb-3 mx-auto">
              <h5 class="card-title text-dark mb-0 p-2">All Admins</h5>
            </div>
            <div class="row align-items-center mb-2 d-flex">
              <div class="col-8">
                <h2 class="d-flex  ms-5 align-items-center mb-0">
                  {{ allMembers }}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-6">
        <div v-if="allMembers >= 0" class="card l-bg-cherry">
          <div class="card-statistic-3 p-2">
            <div class="card-icon card-icon-large"><i class="fas fa-shopping-car"></i></div>
            <div class="mb-3 mx-auto">
              <h5 class="card-title text-dark mb-0 p-2">All members</h5>
            </div>
            <div class="row align-items-center mb-2 d-flex">
              <div class="col-8">
                <h2 class="d-flex  ms-5 align-items-center mb-0">
                  {{ allMembers }}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="stats"></div>
    </div>
</template>
<style scoped>
.card {
  background-color: #fff;
  border-radius: 10px;
  border: none;
  position: relative;
  margin-bottom: 30px;
  box-shadow: 0 0.46875rem 2.1875rem rgba(90,97,105,0.1), 0 0.9375rem 1.40625rem rgba(90,97,105,0.1), 0 0.25rem 0.53125rem rgba(90,97,105,0.12), 0 0.125rem 0.1875rem rgba(90,97,105,0.1);
}
.card-title {
  padding: 20px 0 15px 0;
  font-size: 19px;
  font-weight: 500;
  color: #fff;
  font-family: "Poppins", sans-serif;
}
</style>
