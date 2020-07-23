import { LoadingController,ToastController  } from '@ionic/angular'

export abstract class Baseui {
    public loadingIsOpen: any = false;
    constructor(){}
    protected async showLoading(loadingCtrl:LoadingController,message:string){
        let loader = await loadingCtrl.create({
            message:message,
            backdropDismiss:true
        })
        return  loader.present()

    }
    protected async showToast(toastCtrl:ToastController,message:string){
        let toast = await toastCtrl.create({
            message:message,
            duration:3000,
            position:'bottom'
        })
        return   toast.present();
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
       await loadingCtrl.dismiss();
    }
  }

}
