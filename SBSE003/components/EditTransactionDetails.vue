<template>
  <div>
    <FormRow>
      <SharecodeLookup
        id="sharecode"
        v-model="trans.sharecode"
        name="sharecode"
        :class="modalMode ? 'col-md-4' : 'col-md-3'"
        :rules="$Yup.string().label('Sharecode').required()"
        required
        @change="sharecodeInfoUpdate($event)"
      />
      <div :class="modalMode ? 'offset-md-2 col-md-6' : 'offset-md-1 col-md-6'">
        <FormRow>
          <FormGroup class-name="col-4">
            <FormInput
              id="mktcode"
              v-model="trans.mktcode"
              label="Market"
              input-name="mktcode"
              placeholder="N/A"
              input-class="form-control-plaintext"
              readonly
            />
          </FormGroup>
          <FormGroup class-name="col-6">
            <FormCheckbox
              id="regisflag"
              v-model="trans.regisflag"
              input-label="Registrar is TSD"
              input-name="regisflag"
              inline
              disabled
            />
          </FormGroup>
        </FormRow>
      </div>
    </FormRow>

    <FormRow>
      <PurposeLookup
        id="fpurpose"
        v-model="trans.fpurpose"
        name="fpurpose"
        label="From Purpose"
        :class="modalMode ? 'col-md-6 col-lg-4' : 'col-md-6 col-lg-3'"
        :readonly="$props.viewMode"
        required
        :rules="$Yup.string().label('From Purpose').required()"
        @change="fpurposeChange"
      />

      <FormGroup
        :class-name="
          modalMode ? 'offset-md-2 col-md-4' : 'offset-md-1 col-md-4'
        "
      >
        <FormInput
          id="availableunit"
          v-model="trans.availableunit"
          type="input"
          name="availableunit"
          label="Available Unit"
          placeholder="0"
          label-class="text-darkblue"
          input-class="form-control-plaintext"
          readonly
        />
      </FormGroup>
    </FormRow>

    <FormRow>
      <FormGroup :class-name="modalMode ? `col-6` : `col-4`">
        <FormRadio
          id="tradeflag"
          v-model="trans.tradeflag"
          label="Trading Flag"
          no-label
          name="tradeflag"
          inline
          :radio-option-list="tradingflagOption"
        />
      </FormGroup>
      <XDate
        v-if="trans.tradeflag === 'N' || trans.fpurpose === '12'"
        id="xdate"
        v-model="trans.xdate"
        name="xdate"
        :class-name="modalMode ? 'col-md-6 col-lg-4' : 'col-md-6 col-lg-3'"
      />
      <FormGroup
        v-if="!modalMode && trans.tradeflag === 'N'"
        class-name="offset-md-2"
      />
      <FormGroup
        v-if="trans.tradeflag === 'N'"
        :class-name="`${modalMode ? 'col-6' : 'col-4'} align-self-center`"
      >
        <ChooseCAInfo
          :params="{
            sharecode: trans.sharecode,
            xdate: trans.xdate,
          }"
          @select="onSelectCAInfo"
        />
      </FormGroup>
      <FormGroup v-if="trans.tradeflag === 'N'" class-name="col-4">
        <FormInput
          id="corprefer"
          v-model="trans.corprefer"
          type="input"
          name="corprefer"
          label="CA Type / Date / No."
          placeholder="N/A"
          input-class="form-control-plaintext"
          readonly
        />
      </FormGroup>
    </FormRow>

    <template v-if="modalMode">
      <FormRow>
        <PurposeLookup
          id="tpurpose"
          v-model="trans.tpurpose"
          name="tpurpose"
          label="To Purpose"
          class="col-md-6 col-lg-4"
          :rules="$Yup.string().label('To Purpose').required()"
          required
        />
      </FormRow>
      <FormRow>
        <FormGroup class-name="col-md-4">
          <FormNumeric
            id="unit"
            v-model="trans.unit"
            label="จำนวนหุ้น / Unit"
            input-name="unit"
            format="n0"
            required
            :rules="
              $Yup
                .number()
                .label('Unit')
                .required()
                .integer()
                .positive()
                .moreThan(0)
            "
          />
        </FormGroup>
        <FormGroup class-name="offset-md-2 col-md-4">
          <FormNumeric
            id="avgprice"
            v-model="trans.avgprice"
            label="Avg. Cost"
            input-name="avgprice"
            format="n6"
            required
            :rules="
              $Yup.number().label('Avg. Cost').required().positive().moreThan(0)
            "
            class-name="offset-md-2 col-md-4"
          />
        </FormGroup>
      </FormRow>
    </template>
    <template v-else-if="!modalMode">
      <FormRow>
        <PurposeLookup
          id="tpurpose"
          v-model="trans.tpurpose"
          name="tpurpose"
          label="To Purpose"
          class="col-md-6 col-lg-3"
          :rules="$Yup.string().label('To Purpose').required()"
          required
        />
        <FormGroup class-name="offset-md-1 col-md-3">
          <FormNumeric
            id="unit"
            v-model="trans.unit"
            label="จำนวนหุ้น / Unit"
            input-name="unit"
            format="n0"
            required
            :rules="
              $Yup
                .number()
                .label('Unit')
                .required()
                .integer()
                .positive()
                .moreThan(0)
            "
          />
        </FormGroup>
        <FormGroup class-name="offset-md-2 col-md-3">
          <FormNumeric
            id="avgprice"
            v-model="trans.avgprice"
            label="Avg. Cost"
            input-name="avgprice"
            format="n6"
            required
            :rules="
              $Yup.number().label('Avg. Cost').required().positive().moreThan(0)
            "
          />
        </FormGroup>
      </FormRow>
    </template>
    <FormRow>
      <ObjectiveLookup
        id="objective"
        v-model="trans.objective"
        name="objective"
        :class-name="modalMode ? 'col-md-6' : 'col-md-4'"
      />
      <RemarksLookup
        id="remark"
        v-model="trans.remark"
        name="remark"
        :class-name="modalMode ? 'col-md-6' : 'col-md-5'"
      />
    </FormRow>
  </div>
</template>

<script lang="ts" setup>
// import { TransactionDetail } from '../sbse003';
import { EditTransDetailTypes } from '../ts/sbse003_types';
import { ShareCodeInfo } from '~/components/stditem/SharecodeLookup.vue';
import { PurposeInfo } from '~/components/utils/PurposeLookup.vue';
import {
  InqSTKPortfolioParams,
  inqAvgPrice,
  inqMaxXdate,
  inqSTKPortfolio,
  inqStockProfile,
} from '~/utils/api-stock';
// import { getDateFormatter } from '~/utils/formatter';

interface InqAvgPriceParams {
  custtype: string;
  custacct: string;
  custcode: string;
}
const props = withDefaults(
  defineProps<{
    modelValue: EditTransDetailTypes;
    avgPriceParams: InqAvgPriceParams;
    modalMode?: boolean;
    viewMode?: boolean;
  }>(),
  {
    modalMode: false,
    modelValue: () => {
      return {
        account: '',
        sharecode: '',
        mktcode: '',
        regisflag: false,
        fpurpose: '',
        corprefer: '',
        xdate: '',
        avgprice: '0.000000',
        tradeflag: 'Y',
        tpurpose: '',
        unit: '0',
        objective: '',
        remark: '',
      };
    },
    viewMode: false,
  },
);

const trans = reactive(
  inject<EditTransDetailTypes>('transdetail') as EditTransDetailTypes,
);

type InqStockProfileResponse = {
  mktcode?: string;
  regisflag?: string;
};
const getInqStockProfile =
  async (): Promise<null | InqStockProfileResponse> => {
    console.log('1️⚠️# getInqStockProfile!!');
    console.log('# trans.sharecode: ', trans.sharecode);
    try {
      const response: null | InqStockProfileResponse = await inqStockProfile({
        sharecode: trans.sharecode,
      });
      console.log('# InqStockPortfolio Response: ', response);
      return response;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };

type InqSTKPortfolioResponse = {
  availableunit: null | string;
  tradeflag: string;
} | null;
const getInqSTKPortfolio = async (): Promise<InqSTKPortfolioResponse> => {
  console.log('2⚠️# getInqSTKPortfolio');
  console.log('# dataItem: ', {
    account: props.modelValue.account,
    sharecode: trans.sharecode,
    purpose: trans.fpurpose,
  });
  const response: { [key: string]: any } = await inqSTKPortfolio({
    account: props.modelValue.account,
    sharecode: trans.sharecode,
    purpose: trans.fpurpose,
  } as InqSTKPortfolioParams);
  console.log('# setDataFromPortfolio | response: ', response);
  const list: InqSTKPortfolioResponse | null =
    response?.lists_total > 0 ? response.lists[0] : null;
  return list;
};

const getInqAvgPrice = async (): Promise<string> => {
  let avgprice = '0.000000';
  try {
    const response: { [key: string]: any } = await inqAvgPrice({
      reftype: 'TC',
      custtype: props.avgPriceParams?.custtype,
      custacct: props.avgPriceParams?.custacct,
      custcode: props.avgPriceParams?.custcode,
      sharecode: trans.sharecode,
      purpose: trans.fpurpose,
      unit: trans.unit,
    });
    console.log('# inqAvgPrice | response: ', response);
    if (response.result === 'Y') {
      avgprice = response.avgprice;
    }
  } catch (err: any) {
    console.error(err.message);
  }
  return avgprice;
};

const setInqAvgPrice = async (): Promise<void> => {
  console.log('# setInqAvgPrice');
  const avgprice = await getInqAvgPrice();
  trans.avgprice = avgprice;
};

const setInqMaxXdate = async (): Promise<void> => {
  console.log('# setInqMaxXdate!!');
  try {
    const response: { [key: string]: any } = await inqMaxXdate({
      sharecode: trans.sharecode,
    });
    console.log('# response: ', response);
    let xdateValue = '';
    if (response?.result === 'Y') {
      xdateValue = response.xdate;
    }
    trans.xdate = xdateValue;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const onSelectCAInfo = (dataItem: { [key: string]: any }): any => {
  console.log('#🤣🤣🤣onSelectCAInfo: ', dataItem);
  trans.xdate = dataItem.xdate;
  trans.corprefer = dataItem.corprefer;
};

const defaultNumeric = '0';
const sharecodeInfoUpdate = async (
  dataitem: ShareCodeInfo | null,
): Promise<void> => {
  console.log('😊 # sharecode info update!!');
  console.log('😊 # dataitem: ', dataitem);
  const sharecode = dataitem?.sharecode;
  console.log('😊 # sharecode: ', sharecode);
  if (sharecode) {
    console.log('# ✅ Set Value!!');
    trans.sharecode = sharecode;
    Promise.all([getInqStockProfile(), getInqSTKPortfolio()]).then((result) => {
      const respStockProfile: null | InqStockProfileResponse = result[0];
      const respSTKPortfolio: null | InqSTKPortfolioResponse = result[1];
      console.log('1️⃣ respStockProfile: ', respStockProfile);
      console.log('2️⃣ respSTKPortfolio: ', respSTKPortfolio);

      console.log('# mktcode: ', respStockProfile?.mktcode || '');
      console.log('# regisflag: ', respStockProfile?.regisflag);
      console.log('# availableunit: ', respSTKPortfolio?.availableunit);

      trans.mktcode = respStockProfile?.mktcode || '';
      trans.regisflag = respStockProfile?.regisflag === '1' || false;
      console.log('# trans.mktcode: ', trans.mktcode);
      console.log('# trans.regisflag: ', trans.regisflag);
      trans.availableunit = respSTKPortfolio?.availableunit || defaultNumeric;
      // emit('update:modelValue', trans);
    });
    if (trans.fpurpose === '12' || trans.tradeflag === 'N') {
      await setInqMaxXdate(); /* Set InqMaxXDate */
    }
  } else {
    console.log('# ⛔ Set Default!!');
    trans.sharecode = '';
    trans.mktcode = ''; /* Default mktcode */
    trans.regisflag = false; /* Default regisflag */
    trans.availableunit = defaultNumeric;
    trans.avgprice = defaultNumeric;
  }
  await setInqAvgPrice;
};

const fpurposeChange = async (dataitem: PurposeInfo | null): Promise<void> => {
  console.log('# fpurposeDetails Change!!');
  if (dataitem != null && trans.fpurpose) {
    const respSTKPortfolio: null | InqSTKPortfolioResponse =
      await getInqSTKPortfolio();
    console.log('# getInqSTKPortfolio: ', respSTKPortfolio);
    trans.availableunit = respSTKPortfolio?.availableunit || defaultNumeric;
    trans.tradeflag = respSTKPortfolio?.tradeflag || 'Y';
    if (trans.fpurpose === '12' || trans.tradeflag === 'N') {
      setInqMaxXdate(); /* Set InqMaxXDate */
    }
  } else {
    trans.availableunit = defaultNumeric; /* Default availableunit */
    trans.tradeflag = 'Y'; /* Default tradeflag */
  }
  await setInqAvgPrice;
};

watch(
  () => trans.tradeflag,
  (value: string) => {
    console.log('👁️ Transaction TradeFlag | value: ', value);
    if (value === 'N' || trans.fpurpose === '12') {
      setInqMaxXdate(); /* Set InqMaxXDate */
    }
  },
);
</script>
