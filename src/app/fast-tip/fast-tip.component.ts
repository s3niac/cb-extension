import {Component} from '@angular/core';
import {TipService} from '../services/tip.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-fast-tip',
  templateUrl: './fast-tip.component.html',
  styleUrls: ['./fast-tip.component.scss']
})
export class FastTipComponent {
  fastTipGroup: FormGroup;
  tipsPatternControl: FormControl;
  patternRepeatControl: FormControl;

  constructor(private tipService: TipService,
              formBuilder: FormBuilder) {
    this.tipsPatternControl = formBuilder.control('1 1 1 5 1 1 5');
    this.patternRepeatControl = formBuilder.control(1);
    this.fastTipGroup = formBuilder.group({
      pattern: this.tipsPatternControl,
      repeat: this.patternRepeatControl,
    });
  }

  get overallTips(): number {
    return this.tipService.tipPatternSum(this.tipsPatternControl.value, this.patternRepeatControl.value);
  }

  sendTips(): void {
    this.tipService.tipPattern(this.tipsPatternControl.value, this.patternRepeatControl.value);
  }
}
