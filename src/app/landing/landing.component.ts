import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { ColorThiefService } from '../services/color-thief.service';
import { TournamentsService } from '../services/tournaments.service';
import Swiper from 'swiper';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TournamentsComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit {
  majorTournaments: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private colorThiefService: ColorThiefService,
    private tournamentsService: TournamentsService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      var swiper = new Swiper('.mySwiper', {
        autoplay: true,
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

      swiper.on('slideChange', () => {
        const activeIndex = swiper.activeIndex;
        const activeSlide = swiper.slides[activeIndex];
        const imgElement = activeSlide.querySelector('img');

        if (imgElement) {
          const imgSrc = imgElement.getAttribute('src');
          this.getColor(imgSrc);
        }
      });
    }
  }

  ngOnInit(): void {
    this.getMajorTournaments();
  }

  getMajorTournaments() {
    this.majorTournaments = this.tournamentsService.getMajorTournaments();
    this.getColor(this.majorTournaments[0].imageUrl);
  }

  getColor(imageUrl: any) {
    this.colorThiefService.getPalette(imageUrl, 5).then((palette) => {
      let colors = '';

      if (palette && palette.length > 1) {
        for (let index = 1; index < 3; index++) {
          const element = palette[index];
          colors = colors + `rgb(${element[0]},${element[1]},${element[2]}),`;
        }
      }
      colors = colors.slice(0, -1);
      var gradient = `background-image: linear-gradient(to bottom, ${colors}, #0D0E11);`;
      if (isPlatformBrowser(this.platformId)) {
        const element = document.getElementById('back');
        if (element) {
          element.style.cssText = gradient;
        }
      }
    });
  }
}
