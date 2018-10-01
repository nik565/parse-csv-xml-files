import { Pipe, PipeTransform } from '@angular/core';
import { CsvElement } from './models/csv.model';

@Pipe({
  name: 'countFilter'
})
export class CountFilterPipe implements PipeTransform {

  transform(value, filterBy: number): CsvElement[] {
    filterBy = filterBy ? filterBy : null;
        return filterBy ? value.data.filter((data: CsvElement) => {
            return (data.issueCount === filterBy);
        }) : value;
  }

}
