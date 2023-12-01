<template>
  <div v-if="$props.fadeConfirmslip" class="row justify-content-center">
    <div
      class="p-0 col-sm-12 col-md-10 col-xl-8"
      :style="{ boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15) !important' }"
    >
      <div id="confirmslip" ref="printingElement">
        <h5
          class="title-slip m-0 py-2 text-white text-center"
          :style="{ background: 'rgb(26, 187, 156)' }"
        >
          Confirmation Slip
        </h5>
        <div class="p-4 bg-white">
          <PDFAndPrint
            :print-element="printingElement"
            :pdf-name="'Slip_' + referno"
          />
          <div id="previewDetails">
            <FormRow>
              <div class="form-group">
                <span>{{ account }}</span>
              </div>
            </FormRow>
            <FormRow>
              <div class="d-flex">
                <label>เลขที่รายการอ้างอิง :</label>&nbsp;
                <div class="form-group">
                  <span class="input-form-control">{{ referno }}</span>
                </div>
              </div>
            </FormRow>
            <hr class="pt-1" />
            <FormRow>
              <div class="col align-self-start">
                <div class="form-group">
                  <label>หลักทรัพย์ / Symbol</label>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <span class="input-form-control">{{ symbol }}</span>
                </div>
              </div>
            </FormRow>
            <FormRow>
              <div class="col align-self-start">
                <div class="form-group">
                  <label>Purpose</label>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <span class="input-form-control">{{ purpose }}</span>
                </div>
              </div>
            </FormRow>
            <FormRow>
              <div class="col align-self-start">
                <div class="form-group">
                  <label>Avg.Cost</label>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <span class="input-form-control">{{ avgcost }}</span>
                </div>
              </div>
            </FormRow>
            <div class="mt">
              <hr class="w-100 bold" />
              <div class="row">
                <div class="col align-self-start">
                  <div class="form-group">
                    <label>จำนวนหุ้น / Unit</label>
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <span class="input-form-control text-dark"
                      >{{ unit }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pdf-footer">
              <div class="col pt-5">
                <div class="text-muted">
                  <label class="w-100 mb-0">
                    บริษัทหลักทรัพย์ กรุงศรี จำกัด (มหาชน)
                  </label>
                  <label class="w-100 mb-0">
                    898 อาคารเพลินจิตทาวเวอร์ ชั้น 3 ถนนเพลินจิต แขวงลุมพินี
                  </label>
                  <label class="w-100 mb-0">เขตปทุมวัน กรุงเทพฯ 10330</label>
                  <label class="w-100 mb-0">Tel no. 0-2659-7000</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex px-0 py-4 col-sm-12 col-md-10 col-xl-8">
      <MDBBtn
        :style="{
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(28, 206, 172)',
        }"
        @click="onClickBack"
        >BACK</MDBBtn
      >
      <MDBBtn
        :style="{
          marginLeft: '8px',
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(153, 153, 153)',
        }"
        @click="onClickReturnHome"
        >RETURN HOME</MDBBtn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';
import { getNumberFormatter } from '@/utils/formatter';

interface Props {
  fadeConfirmslip: boolean;
  response: { [key: string]: any };
}
const props = withDefaults(defineProps<Props>(), {
  fadeConfirmslip: false,
  response: undefined,
});
const emit = defineEmits<{
  (e: 'updateFade', fadeConfirmslip: boolean): void;
}>();

const printingElement = ref<HTMLDivElement | null>(null);
const account = ref('');
const referno = ref('');
const symbol = ref('');
const purpose = ref('');
const avgcost = ref('');
const unit = ref('');

watch(props, () => {
  if (props.response !== undefined) {
    account.value = props.response.faccount + '\n' + props.response.fcustname;
    referno.value = props.response.referno;
    symbol.value = props.response.fsharecode;
    purpose.value =
      props.response.fpurpose +
      ' : ' +
      props.response.fpurposedesc +
      ' to ' +
      props.response.tpurpose +
      ' : ' +
      props.response.tpurposedesc;
    avgcost.value = getNumberFormatter(props.response.avgprice, 'n6');
    unit.value = getNumberFormatter(props.response.unit, 'n0');
  }
});

function onClickBack() {
  emit('updateFade', false);
}

function onClickReturnHome() {
  console.log('#Click Return Home!');
}
</script>

<style scoped>
.title-slip {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
