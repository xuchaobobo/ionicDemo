/*
 * @Author: your name
 * @Date: 2020-05-08 11:11:47
 * @LastEditTime: 2020-05-08 13:37:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\file\file.service.ts
 */
import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview'

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }
  getProducts(): TreeviewItem[] {
    const fruitCategory = new TreeviewItem({
        text: 'Fruit', value: 1, children: [
            { 
              text: 'Apple', value: 11,
              children: [
                { 
                  text: 'Apple', value: 11,
                  
                 },
                { text: 'Mango', value: 12 }
            ]
             },
            { text: 'Mango', value: 12 }
        ]
    });
    const vegetableCategory = new TreeviewItem({
        text: 'Vegetable', value: 2, children: [
            { text: 'Salad', value: 21 },
            { text: 'Potato', value: 22 }
        ]
    });
    vegetableCategory.children.push(new TreeviewItem({ text: 'Mushroom', value: 23, checked: false }));
    vegetableCategory.correctChecked(); 
    return [fruitCategory, vegetableCategory];
  }
}
