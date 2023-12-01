import { createApp, h } from 'vue';
import PopupConfirmCenter from '@/components/popup/PopupConfirm.vue';
export interface BtnAction {
  color?: string;
  clicked?: Function | null;
  innerHTML?: string;
}

interface PopupProps {
  message: string;
  backdrop?: true;
  size?: 'md';
}

interface confirmProps extends PopupProps {
  title: string;
  icon?: string;
  iconname?: string;
  confirmBtn?: BtnAction;
  cancelBtn?: BtnAction;
}

interface alertProps extends PopupProps {
  callback: Function;
}

const renderPopup = (opt: confirmProps) => {
  let container = document.getElementById('popup-center');
  if (container == null) {
    container = document.createElement('div'); // Create a container element
    container.id = 'popup-center';
  }
  const componentVNode = h(
    PopupConfirmCenter as Component,
    {
      visible: true,
      icon: opt.icon,
      iconname: opt.iconname,
      confirmbtn: {
        color: opt.confirmBtn?.color,
        clicked: opt.confirmBtn?.clicked,
      },
      cancelbtn: {
        color: opt.cancelBtn?.color,
        clicked: opt.cancelBtn?.clicked,
      },
    },
    {
      icon: () => opt.icon || '',
      title: () => opt.title,
      body: () => opt.message,
    },
  );
  const app = createApp({
    render: () => componentVNode,
  });
  app.mount(container); // Mount the component vnode inside the container element
  document.getElementById('__nuxt')?.appendChild(container);
};

const popup = {
  confirm: (opt: confirmProps): void => {
    renderPopup(opt);
  },
  alert: (opt: alertProps): void => {
    console.log('# Popup Alert | message: ', opt.message);
    console.log('# Popup Alert | callback: ', opt.callback);
  },
  // confirmSaveDraft: (message: string, callback: Function): void => {},
  // confirmSubmit: (message: string, callback: Function): void => {},
  confirmFirstPage: (): void => {},
  confirmActionFlow(opt: {
    actiontype: string;
    confirm: Function | null;
    cancel: Function | null;
  }) {
    console.log('# confirmActionFlow !!');
    let icon = '';
    let iconname = '';
    let title = '';
    let btncolor = 'success';
    switch (opt.actiontype) {
      case 'S' /* Submit Button */:
        icon = '<i class="fas fa-plus-circle"></i>';
        // iconname = 'add_circle';
        title = 'Add Transaction';
        break;
      case '0' /* Save Draft Button */:
        // icon = '<i class="glyphicon glyphicon-floppy-disk fa-2x"></i>';
        icon = '<i class="fa fa-save"></i>';
        iconname = 'save';
        title = 'Save Draft';
        break;
      case 'D' /* Delete Button */:
        // icon = '<i class="glyphicon glyphicon-trash fa-2x"></i>';
        icon = '<i class="glyphicon glyphicon-trash"></i>';
        iconname = 'delete';
        title = 'Delete Transaction';
        btncolor = 'danger';
        break;
    }
    this.confirm({
      title,
      icon,
      iconname,
      confirmBtn: {
        color: btncolor,
        clicked: opt.confirm != null ? opt.confirm : null,
      },
      cancelBtn: {
        color: 'grey',
        clicked: opt.cancel != null ? opt.cancel : null,
      },
      message: 'Are you sure you want to continue?',
    });
  },
};

export default popup;
