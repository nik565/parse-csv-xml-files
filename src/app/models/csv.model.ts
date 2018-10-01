export class CsvElement {
    firstName: string;
    surName: string;
    issueCount: number;
    dob: Date;

    constructor() {
      this.firstName = '';
      this.surName = '';
      this.issueCount = null;
      this.dob = null;
    }
}
