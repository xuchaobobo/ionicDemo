import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return moment(value).format('YYYY/MM/DD HH:mm:ss');
  }

}
