import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
  standalone: true
})
export class RuntimePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value || value === 'N/A') {
      return 'N/A';
    }

    const match = value.match(/(\d+)\s*min/);
    if (!match) {
      return value;
    }

    const totalMinutes = parseInt(match[1], 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }
}


