import { Injectable } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class UserPasswordService {
  constructor() { }

  hashPassword(input){
    return Md5.hashStr(input).toString();
  }

  authentication(input, hashedPass){
    return hashedPass === Md5.hashStr(input).toString();
  }
}
