import { LoadingController,ToastController  } from '@ionic/angular'

export abstract class Baseui {
    public loadingIsOpen: any = false;
    constructor(){}
    protected async showLoading(loadingCtrl:LoadingController,message:string){
        let loader = await loadingCtrl.create({
            message:message,
            backdropDismiss:true
        })
        await loader.present()
        return loader

    }
    protected async showToast(toastCtrl:ToastController,message:string){
        let toast = await toastCtrl.create({
            message:message,
            duration:3000,
            position:'bottom'
        })
        toast.present();
        return toast;
    }
    //loading加载
  async show(loadingCtrl: LoadingController) {
    this.loadingIsOpen = true;
    return await loadingCtrl.create({
      duration: 7000,
      message: "请稍后···"
    }).then(a => {
      a.present().then(() => {
        if (!this.loadingIsOpen) {
          a.dismiss()
        }
      });
    });
  }

  //loading结束
  async hide(loadingCtrl: LoadingController) {
    if (this.loadingIsOpen == true) {
      this.loadingIsOpen = false;
      return await loadingCtrl.dismiss();
    }
  }

}
