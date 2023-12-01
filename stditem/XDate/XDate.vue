<template>
  <FormGroup id="xdate-box" :class="`form-group ${property.className}`">
    <FormLabel for="xdate" :required="property.required"> X Date </FormLabel>
    <VeeField
      :id="property.id"
      v-model="xdateFormatted"
      :name="property.name"
      type="hidden"
    />
    <KendoDatePicker
      :id="'xdate'"
      :value="xdate"
      :format="'dd/MM/yyyy'"
      :format-placeholder="'formatPattern'"
      :valid="isValid"
      @change="onChange"
    />
    <!-- <KendoDatePicker
      :id="'xdate'"
      :value="xdate"
      :format="'dd/MM/yyyy'"
      :format-placeholder="'formatPattern'"
      :valid="isValid"
      :calendar="'customCalendar'"
      @change="onChange"
    >
      <template #customCalendar="{ props }">
        <XDateCalendar
          :value="props.value"
          @change="(event: any) => props.onChange(event)"
        />
      </template>
    </KendoDatePicker> -->
    <InputErrorMsg v-if="!isValid" :for="property.id">
      {{ errorMessage }}
    </InputErrorMsg>
  </FormGroup>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { DatePicker as KendoDatePicker } from '@progress/kendo-vue-dateinputs';

interface XDate {
  id?: string;
  name?: string;
  modelValue: string;
  className?: string;
  required?: boolean;
  errorMsg?: string;
  rules?: Yup.StringSchema;
}

const property = withDefaults(defineProps<XDate>(), {
  id: 'xdate',
  name: 'xdate',
  modelValue: '',
  className: '',
  required: false,
  errorMsg: '',
  rules: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', xdate: string): void;
}>();

const holidayLists = ref<Array<object>>([]);
const xdate = ref();
const xdateFormatted = ref();

const fieldSchema = useField(toRef(property, 'name'), property.rules, {
  initialValue: property.modelValue,
});
const { errorMessage } = fieldSchema;
const isValid = computed((): boolean => {
  return errorMessage.value === undefined;
});

onMounted(async () => {
  await lookupCalendar();
  if (property.modelValue) {
    xdateFormatted.value = property.modelValue;
    xdate.value = new Date(
      `${property.modelValue.split('/')[2]}, ${
        property.modelValue.split('/')[1]
      }, ${property.modelValue.split('/')[0]}`,
    );
  }
});

// const disableDates = (date: Date): boolean => {
//   if (!date) return false;
//   if (date.getDay() === 6) return true;
//   if (date.getDay() === 0) return true;
//   let holiday: any;
//   for (holiday of holidayLists.value) {
//     if (
//       holiday.getFullYear() === date.getFullYear() &&
//       holiday.getMonth() === date.getMonth() &&
//       holiday.getDate() === date.getDate()
//     ) {
//       return true;
//     }
//   }
//   return false;
// };

const onChange = (event: any): void => {
  xdate.value = event.target.value;
  xdateFormatted.value = getDateFormatter(xdate.value);
  emit('update:modelValue', xdateFormatted.value);
};

const lookupCalendar = async (): Promise<void> => {
  try {
    const resLookupCalendar: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/lookupcalendar/collect',
      data: {
        from_date: '',
        to_date: '',
      },
    });
    if (resLookupCalendar.result === 'Y') {
      const holidaysDate = [];
      for (const date of resLookupCalendar.lists) {
        if (date.holidaydate.trim()) {
          const d = date.holidaydate.split('/');
          holidaysDate.push(
            new Date(
              parseInt(d[2], 10),
              parseInt(d[1], 10) - 1,
              parseInt(d[0], 10),
            ),
          );
        }
      }
      holidayLists.value = holidaysDate;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

watch(
  () => property.modelValue,
  (value: string) => {
    if (value) {
      xdateFormatted.value = value;
      xdate.value = new Date(
        `${value.split('/')[2]}, ${value.split('/')[1]}, ${
          value.split('/')[0]
        }`,
      );
    }
  },
);
</script>
