<template>
  <div id="previewAction" class="row">
    <div class="col justify-content-end d-flex no-print">
      <span
        id="download_icon"
        type="button"
        title="Download File"
        iconname="system_update_alt"
        class="mi material-icons p-2 mx-1"
        @click="generatePDF"
      >
        system_update_alt
      </span>
      <span
        id="print_icon"
        type="button"
        title="Print"
        iconname="print"
        class="mi material-icons p-2 mx-1"
        @click="printWindow"
      >
        print
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { savePDF } from '@progress/kendo-vue-pdf';
import { PageMargin } from '@progress/kendo-drawing/pdf';

const props = withDefaults(
  defineProps<{
    printMargin: string | PageMargin;
    printElement: HTMLDivElement | null;
    pdfName: string;
  }>(),
  {
    printMargin: '20px',
    pdfName: 'Confirm_Slips',
  },
);

const generatePDF = (): void => {
  const box = document.getElementById('previewAction');
  if (box != null) {
    box.style.display = 'none';
    if (props.printElement !== null) {
      savePDF(props.printElement, {
        paperSize: 'A4',
        margin: { left: 20, right: 20, top: 30, bottom: 20 } as PageMargin,
        fileName: props.pdfName,
        scale: 0.75,
      });
      box.style.display = 'block';
    }
  }
};

const printWindow = (): void => {
  const prtHtml = props.printElement?.innerHTML;

  // Get all stylesheets HTML
  let stylesHtml = '';
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style'),
  ]) {
    stylesHtml += node.outerHTML;
  }

  const iFramePrint = document.createElement('iframe');
  iFramePrint.id = 'iFramePrint';
  iFramePrint.style.height = '0px';

  document.body.appendChild(iFramePrint);

  iFramePrint.contentWindow?.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    <div style="padding: ${props.printMargin}">
      ${prtHtml}
    <div>
  </body>
</html>`);

  iFramePrint.contentWindow?.document.close();
  iFramePrint.onload = () => {
    iFramePrint.contentWindow?.print();
    document.body.removeChild(iFramePrint);
  };
};
</script>

<style scoped>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>
