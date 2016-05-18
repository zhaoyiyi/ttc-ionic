import {Pipe, PipeTransform} from 'angular2/core';
@Pipe({
  name: 'stopTitle'
})
export class StopTitlePipe implements PipeTransform {
  public transform(value: string) {
    console.log(value);
    return value.replace(/(.* - )(\d*\w?)(.*)/, '$2, $1');
  }
}
