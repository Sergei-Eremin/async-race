import { ICar } from '../../types';
import { API } from '../api/api';
import { App } from '../app/app';

export class CarTrack {
  createInputs() {
    return `
      <div class="field__create create">
        <input class="create__input" type="text">
        <input class="create__input" type="color">
        <button>create</button>
      </div>
      `;
  }

  updateInputs() {
    return `
      <div class="field__update update">
        <input class="update__input" type="text" disabled>
        <input class="update__input" type="color" disabled>
        <button disabled>update</button>
      </div>
      `;
  }

  generateTrackWrapper(api: API, app: App) {
    const main = document.createElement('main');
    main.classList.add('garage');
    (document.querySelector('.fields') as HTMLElement).after(main);
    const trackList = document.createElement('div') as HTMLElement;
    const h1 = document.createElement('h1');
    (async () => {
      const garageAmount = await api.getAmountCars();
      h1.innerHTML = `Garage (${garageAmount})`;
    })();
    trackList.classList.add('trackList');
    const page = document.createElement('h2');
    page.innerHTML = `Page <span class="page__number">${app.garagePage}</span>`;
    const pagination = document.createElement('div');
    pagination.innerHTML = `
      <button disabled class="pagination__prev">prev</button>
      <button class="pagination__next">next</button>
      `;
    pagination.classList.add('pagination');
    main.append(page, h1, trackList, pagination);
  }

  paginationHandler(api: API, app: App) {
    const pagination = document.querySelector('.pagination');

    pagination?.addEventListener('click', (event) => {
      const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
      const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;
      const target = event.target as HTMLElement;

      if (target.tagName === 'BUTTON') {
        if (target.className === 'pagination__prev') {
          if (btnPrev.disabled) {
            alert('how you click disabled button??');
          } else {
            app.garagePage -= 1;
          }
        }

        if (target.className === 'pagination__next') {
          if (btnNext.disabled) {
            alert('how you click disabled button??');
          } else {
            app.garagePage += 1;
          }
        }

        this.createTrack(api.getCars(app.garagePage));
        setTimeout(() => this.carHandler(api), 100);
      }

      this.paginationClickableButtons(app, api);
      this.updatePageNumber(app);
    });
  }

  updatePageNumber(app: App) {
    const page = document.querySelector('.page__number') as HTMLSpanElement;
    page.innerText = String(app.garagePage);
  }

  paginationClickableButtons(app: App, api: API) {
    const btnPrev = document.querySelector('.pagination__prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.pagination__next') as HTMLButtonElement;

    if (app.garagePage === 1) {
      btnPrev.disabled = true;
    } else {
      btnPrev.disabled = false;
    }

    (async () => {
      const amount = await api.getAmountCars();
      const pages = Math.ceil(amount / app.tracksOnPage);
      if (pages > app.garagePage) {
        btnNext.disabled = false;
      } else {
        btnNext.disabled = true;
      }
      if (pages < app.garagePage) {
        app.garagePage -= 1;
        this.createTrack(api.getCars(app.garagePage));
        this.updatePageNumber(app);
        setTimeout(() => this.carHandler(api), 100);
      }
    })();
  }

  updateGarageAmount(api: API) {
    const h1 = document.querySelector('h1') as HTMLElement;
    (async () => {
      const garageAmount = await api.getAmountCars();
      h1.innerHTML = `Garage (${garageAmount})`;
    })();
  }

  markupTrack(data: ICar) {
    const { name, color, id } = data;
    return `
          <div class="car-track">
          <h3 class="car__title">${name}</h3>
          <div class="car__buttons">
          <button class="car__button car__button-select">select</button>
          <button class="car__button car__button-remove">remove</button>
          <button class="button-start">A</button>
          <button class="button-stop" disabled>B</button>
          </div>
  
          <div class="car" id="${id}">
          <?xml version="1.0" standalone="no"?>
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="1280.000000pt" height="640.000000pt"
              viewBox="0 0 1280.000000 640.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)" fill="${color}" stroke="none">
              <path d="M3525 5341 c-72 -18 -79 -28 -90 -121 -4 -30 -11 -62 -16 -71 -4 -9
      -97 -51 -206 -94 -774 -304 -1348 -540 -1603 -661 -163 -77 -222 -91 -421
      -104 -85 -5 -170 -14 -189 -20 -101 -32 -362 -58 -620 -63 l-115 -2 -47 -80
      c-47 -78 -47 -80 -29 -100 34 -36 35 -77 5 -177 -30 -99 -34 -178 -19 -370 5
      -67 4 -88 -6 -88 -29 0 -83 -56 -110 -114 -50 -106 -74 -343 -48 -467 13 -58
      13 -62 3 -159 -5 -54 16 -238 28 -244 2 -1 29 -20 61 -41 73 -49 123 -103 132
      -143 17 -79 167 -155 355 -181 104 -15 969 -97 1087 -104 l32 -2 5 160 c7 230
      50 394 146 559 281 479 917 673 1405 429 316 -159 530 -424 598 -742 22 -106
      29 -365 13 -519 l-8 -82 3002 0 c2855 0 3002 1 2995 18 -33 87 -56 325 -45
      461 28 320 177 567 459 759 399 273 847 282 1243 24 239 -157 397 -392 460
      -687 18 -84 15 -341 -5 -430 -8 -38 -14 -71 -12 -73 7 -8 386 20 478 34 180
      28 253 65 304 152 24 41 28 57 28 127 -1 44 -9 117 -20 163 -18 79 -18 88 -2
      190 31 199 40 306 41 497 1 176 -1 195 -23 260 -46 135 -103 190 -283 274
      -222 104 -633 220 -1168 330 -523 108 -1524 210 -2054 211 l-229 0 -236 139
      c-813 477 -1593 884 -1852 966 -498 157 -1598 195 -2892 100 l-188 -14 -47 30
      c-92 58 -223 89 -297 70z m1912 -311 c13 -45 58 -305 88 -515 33 -226 74 -539
      71 -542 -7 -7 -1672 40 -2054 58 -357 16 -464 56 -573 215 -62 91 -87 225 -59
      326 12 40 56 74 192 148 369 198 799 289 1618 340 246 15 290 16 510 16 l194
      -1 13 -45z m649 10 c383 -36 717 -86 934 -139 210 -52 451 -163 720 -332 141
      -88 379 -259 380 -271 0 -5 -14 -8 -32 -8 -48 0 -114 -37 -140 -78 -24 -39
      -30 -113 -15 -189 l9 -43 -904 0 -904 0 -176 540 -175 540 47 0 c25 0 141 -9
      256 -20z" />
              <path d="M2617 3125 c-431 -82 -774 -440 -838 -875 -17 -117 -7 -292 24 -410
      113 -436 497 -751 947 -777 507 -29 959 313 1076 813 28 117 26 348 -4 467
      -94 378 -383 670 -760 768 -105 27 -336 34 -445 14z m378 -310 c84 -21 209
      -85 280 -142 116 -94 210 -242 251 -393 23 -87 24 -260 0 -355 -58 -237 -242
      -439 -473 -519 -531 -186 -1074 277 -969 828 30 152 94 274 206 386 111 110
      237 178 385 206 84 16 235 11 320 -11z" />
              <path d="M2918 2568 c2 -90 7 -167 12 -172 17 -17 108 58 201 166 l51 57 -48
      31 c-52 33 -131 65 -185 75 l-34 6 3 -163z" />
              <path d="M2591 2700 c-62 -22 -167 -82 -164 -94 3 -13 237 -216 249 -216 7 0
      15 7 18 16 8 20 8 127 -1 232 -7 95 -8 96 -102 62z" />
              <path d="M3209 2355 c-57 -64 -105 -123 -107 -131 -6 -25 46 -35 157 -29 58 3
      121 8 139 11 33 5 34 6 27 42 -7 44 -64 167 -92 201 l-19 24 -105 -118z" />
              <path d="M2260 2409 c-31 -44 -68 -133 -77 -186 l-6 -33 155 0 c165 0 201 9
      181 44 -13 24 -204 216 -214 216 -5 0 -22 -18 -39 -41z" />
              <path d="M2786 2354 c-36 -35 0 -87 44 -64 26 14 26 56 1 70 -25 13 -27 13
      -45 -6z" />
              <path d="M2751 2186 c-57 -32 -68 -111 -22 -157 43 -42 101 -43 143 -1 42 42
      41 100 -1 143 -33 32 -78 38 -120 15z" />
              <path d="M2560 2136 c-19 -23 -8 -61 18 -64 44 -7 67 32 36 62 -19 20 -38 20
      -54 2z" />
              <path d="M3002 2124 c-27 -19 -28 -36 -3 -58 25 -23 61 -6 61 29 0 33 -30 49
      -58 29z" />
              <path d="M2245 1993 c-77 -6 -76 -5 -59 -65 16 -55 61 -146 92 -186 l18 -23
      103 122 c57 67 104 129 105 138 1 14 -14 16 -104 17 -58 0 -127 -1 -155 -3z" />
              <path d="M3165 1981 c-44 -4 -61 -10 -63 -22 -3 -16 210 -229 228 -229 22 0
      86 141 105 228 l7 32 -109 -2 c-59 -1 -135 -4 -168 -7z" />
              <path d="M2776 1914 c-19 -18 -19 -20 -6 -45 6 -11 21 -19 35 -19 20 0 45 24
      45 44 0 10 -32 36 -45 36 -7 0 -21 -7 -29 -16z" />
              <path d="M2589 1743 c-86 -90 -139 -151 -139 -162 0 -25 179 -101 236 -101
      l27 0 -7 143 c-9 166 -13 187 -35 187 -9 0 -46 -30 -82 -67z" />
              <path d="M2936 1801 c-6 -10 -24 -168 -29 -258 -3 -60 -2 -63 19 -63 79 0 262
      68 248 92 -5 7 -53 64 -108 126 -93 105 -117 124 -130 103z" />
              <path d="M10723 3125 c-318 -58 -597 -266 -743 -555 -223 -441 -98 -996 289
      -1288 112 -84 188 -125 311 -166 274 -91 545 -70 802 61 552 282 735 983 392
      1500 -225 339 -651 521 -1051 448z m385 -315 c348 -98 579 -443 532 -796 -67
      -508 -596 -796 -1055 -574 -239 116 -396 352 -412 620 -20 335 192 640 516
      745 122 40 289 42 419 5z" />
              <path d="M11017 2568 c3 -90 9 -167 14 -172 13 -14 53 18 155 122 l95 97 -23
      18 c-50 40 -189 97 -235 97 -10 0 -11 -33 -6 -162z" />
              <path d="M10705 2706 c-50 -16 -133 -58 -163 -82 l-23 -19 121 -107 c67 -60
      128 -108 135 -108 23 0 27 39 20 186 -8 162 -4 157 -90 130z" />
              <path d="M11307 2354 c-59 -65 -107 -126 -107 -136 0 -11 11 -18 38 -22 44 -7
      278 7 289 17 15 16 -51 183 -94 236 l-19 24 -107 -119z" />
              <path d="M10362 2413 c-39 -62 -70 -134 -78 -184 l-7 -39 152 0 c86 0 161 5
      172 10 17 10 18 13 5 38 -8 15 -59 71 -114 125 l-99 99 -31 -49z" />
              <path d="M10888 2359 c-24 -14 -23 -56 2 -69 44 -23 80 29 44 64 -18 19 -23
      19 -46 5z" />
              <path d="M10851 2187 c-49 -29 -66 -101 -35 -146 9 -13 32 -29 50 -37 29 -12
      39 -12 68 0 99 41 85 180 -19 192 -24 3 -50 -1 -64 -9z" />
              <path d="M10660 2136 c-19 -23 -8 -61 18 -64 44 -7 67 32 36 62 -19 20 -38 20
      -54 2z" />
              <path d="M11096 2124 c-9 -8 -16 -22 -16 -29 0 -13 26 -45 36 -45 20 0 44 25
      44 45 0 14 -8 29 -19 35 -25 13 -27 13 -45 -6z" />
              <path d="M10335 1991 c-60 -6 -60 -6 -57 -36 9 -69 104 -248 122 -229 57 61
      210 250 207 258 -4 12 -176 17 -272 7z" />
              <path d="M11267 1983 c-68 -5 -79 -19 -47 -60 23 -31 200 -193 210 -193 3 0
      20 24 37 53 29 48 52 111 67 180 l6 27 -107 -2 c-60 -1 -134 -3 -166 -5z" />
              <path d="M10870 1910 c-16 -31 4 -62 38 -58 21 2 28 9 30 32 5 45 -47 65 -68
      26z" />
              <path d="M10651 1703 c-56 -59 -101 -113 -101 -120 0 -28 172 -103 237 -103
      l26 0 -7 123 c-10 179 -15 207 -36 207 -10 0 -63 -48 -119 -107z" />
              <path d="M11035 1801 c-7 -12 -23 -144 -29 -243 -4 -77 -4 -78 19 -78 45 0
      130 22 193 51 l64 29 -19 23 c-65 82 -198 227 -209 227 -7 0 -15 -4 -19 -9z" />
              </g>
          </svg>
  
  
          </div>
          <div class="finish">
          <?xml version="1.0" standalone="no"?>
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="1280.000000pt" height="640.000000pt"
              viewBox="0 0 1280.000000 640.000000" preserveAspectRatio="xMidYMid meet">
              <metadata>
              Created by potrace 1.15, written by Peter Selinger 2001-2017
              </metadata>
              <g transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
              <path d="M9025 5815 c-11 -13 -112 -124 -225 -247 -260 -284 -2406 -2669
          -2425 -2695 -1 -2 -58 61 -126 139 -352 404 -1854 2109 -2129 2417 -173 194
          -322 362 -332 372 -22 25 -34 24 -95 -11 -57 -33 -85 -64 -76 -87 5 -14 -6
          -15 -83 -9 -238 17 -400 18 -499 2 -269 -41 -491 -147 -673 -320 -153 -147
          -250 -304 -528 -858 -213 -426 -320 -617 -425 -759 -157 -211 -360 -364 -560
          -423 -164 -47 -449 -61 -654 -31 -110 16 -195 19 -195 8 0 -14 591 -697 1709
          -1978 l533 -610 136 -28 c111 -23 166 -29 287 -30 164 -1 219 9 490 90 155 46
          214 76 322 166 229 191 321 331 634 962 274 553 394 743 583 921 211 200 444
          284 787 284 139 0 273 -14 411 -43 56 -12 57 -13 178 -152 67 -77 131 -150
          142 -161 l19 -21 -437 -489 c-846 -945 -1334 -1496 -1334 -1507 0 -9 146 -97
          161 -97 25 0 0 -27 1458 1603 161 181 294 327 295 325 4 -5 1237 -1413 1500
          -1713 125 -143 239 -266 253 -273 22 -12 30 -9 99 33 41 26 74 51 74 56 0 14
          -421 501 -1378 1593 -221 252 -402 462 -402 466 0 7 239 280 304 348 48 50
          464 90 658 63 497 -70 756 -316 1114 -1056 310 -644 372 -758 496 -916 98
          -126 256 -267 353 -316 85 -43 393 -133 528 -154 103 -16 259 -7 426 25 73 14
          134 26 136 28 1 2 244 275 541 608 1166 1308 1714 1928 1722 1951 5 13 -75 11
          -213 -6 -265 -32 -517 -9 -700 64 -136 55 -244 131 -365 257 -152 159 -258
          330 -462 744 -77 157 -173 353 -214 435 -84 171 -193 359 -264 455 -62 83
          -197 215 -276 268 -249 167 -546 239 -879 211 -216 -19 -220 -18 -221 8 -2 31
          -20 50 -79 84 -60 35 -74 35 -100 4z m889 -164 c59 -11 112 -23 117 -28 11
          -11 -26 -65 -114 -168 -65 -76 -310 -355 -311 -355 -1 0 -37 12 -81 25 -175
          56 -458 78 -634 51 -124 -19 -131 -19 -131 -5 0 15 148 185 279 321 113 118
          179 160 281 177 91 16 468 5 594 -18z m-6409 -1 c80 -16 147 -51 213 -114 59
          -55 342 -379 342 -391 0 -7 -15 -6 -194 16 -146 17 -380 1 -523 -37 -54 -15
          -107 -29 -118 -31 -17 -4 -53 33 -180 182 -198 231 -269 325 -257 337 11 11
          145 35 272 47 115 12 362 6 445 -9z m7194 -685 c77 -135 176 -331 211 -416 27
          -68 24 -89 -27 -157 -65 -85 -354 -402 -368 -402 -7 0 -70 112 -140 250 -124
          244 -211 394 -224 388 -10 -4 -152 -159 -304 -330 -72 -82 -136 -148 -143
          -148 -7 0 -58 52 -114 115 -103 116 -197 195 -329 276 -39 24 -71 49 -71 55 0
          15 51 85 119 164 122 141 304 330 318 330 74 0 327 -202 485 -388 l45 -53 156
          174 c85 95 186 202 223 236 79 74 62 84 163 -94z m-8374 42 c55 -57 151 -162
          214 -235 l115 -132 49 58 c120 138 297 291 402 347 86 45 87 45 251 -137 200
          -222 293 -348 256 -348 -18 0 -222 -140 -277 -190 -32 -29 -94 -92 -138 -141
          -44 -49 -88 -89 -96 -88 -9 0 -36 24 -61 53 -156 181 -376 426 -382 426 -16 0
          -101 -144 -217 -368 -125 -241 -142 -272 -152 -272 -9 0 -260 282 -340 382
          -77 96 -80 116 -35 215 88 195 278 533 299 533 7 0 57 -46 112 -103z m6510
          -337 c130 -13 251 -39 278 -60 20 -17 20 -18 3 -45 -21 -33 -275 -322 -354
          -405 l-57 -59 -145 29 c-187 38 -353 47 -550 30 -83 -7 -153 -11 -156 -8 -7 7
          64 91 268 319 l157 176 108 12 c59 7 117 14 128 15 47 7 228 5 320 -4z m-4378
          -40 l73 -12 163 -187 c182 -208 270 -312 265 -316 -2 -2 -59 3 -128 11 -230
          24 -394 17 -625 -27 l-110 -21 -48 52 c-110 120 -349 403 -359 426 -10 20 -9
          27 3 35 21 14 85 30 174 45 98 16 485 12 592 -6z m5301 -606 c29 -43 101 -176
          162 -294 60 -118 116 -224 124 -235 13 -19 19 -15 113 85 55 58 151 161 214
          229 63 69 120 126 126 128 6 2 67 -106 137 -245 123 -243 209 -392 226 -392 5
          0 104 106 221 235 117 129 216 235 220 235 3 0 42 -41 85 -91 120 -139 212
          -220 336 -294 62 -37 115 -69 117 -71 2 -1 -55 -67 -126 -146 -214 -238 -293
          -332 -293 -350 0 -16 66 -37 187 -59 133 -24 322 -30 521 -15 87 6 122 6 122
          -2 0 -21 -103 -137 -274 -309 -138 -138 -179 -174 -211 -182 -122 -34 -396
          -36 -608 -6 -96 14 -187 45 -187 63 0 17 62 96 209 267 173 201 191 223 191
          241 0 8 -24 26 -52 40 -105 53 -256 182 -394 337 -34 37 -68 67 -75 67 -8 0
          -62 -53 -119 -117 -181 -203 -321 -353 -331 -353 -16 0 -66 89 -198 350 -71
          140 -136 264 -145 275 -18 23 3 43 -279 -263 -92 -100 -172 -182 -176 -182 -5
          0 -70 120 -144 268 -139 272 -203 385 -217 380 -4 -2 -81 -86 -170 -188 -90
          -102 -187 -212 -217 -244 l-55 -59 -122 129 c-136 143 -244 231 -329 269 -84
          37 -80 55 37 194 116 138 316 356 329 359 17 3 168 -88 256 -155 40 -31 118
          -108 173 -170 l101 -114 25 23 c13 13 112 119 219 236 107 117 200 211 207
          209 6 -1 35 -39 64 -83z m-6429 -156 c112 -126 210 -232 219 -235 10 -4 33 15
          70 58 129 149 245 245 400 331 l74 40 51 -58 c295 -331 372 -427 365 -461 -2
          -11 -27 -29 -63 -46 -87 -42 -207 -140 -334 -273 l-111 -118 -31 30 c-17 16
          -117 129 -222 251 l-191 222 -34 -51 c-19 -28 -99 -173 -177 -322 -83 -160
          -147 -271 -156 -271 -7 0 -105 101 -216 225 -111 124 -207 226 -212 228 -14 5
          -46 -49 -159 -273 -112 -220 -193 -360 -208 -360 -10 0 -107 105 -317 343 -60
          68 -115 126 -123 129 -8 3 -66 -48 -151 -134 -132 -133 -262 -237 -337 -268
          -66 -28 -70 -20 121 -246 178 -212 234 -286 227 -303 -28 -74 -643 -104 -804
          -40 -44 18 -300 273 -409 409 -55 69 -61 80 -45 85 11 4 84 1 164 -7 170 -16
          335 -10 492 18 117 21 158 35 158 55 0 17 -87 125 -264 327 -81 93 -146 170
          -144 172 1 1 53 32 114 68 149 88 191 123 313 261 58 64 110 115 116 114 6 -2
          105 -108 219 -235 114 -128 210 -233 214 -233 19 0 104 144 239 406 54 105
          105 201 114 214 15 23 16 22 203 -186 103 -115 203 -221 221 -237 l33 -27 25
          42 c13 24 55 104 92 178 106 212 229 412 253 409 4 0 99 -104 211 -231z m4726
          -238 c100 -22 179 -54 173 -69 -2 -5 -93 -109 -203 -232 -110 -122 -205 -229
          -210 -236 -8 -11 -28 -8 -110 17 -168 52 -263 63 -485 56 -107 -3 -210 -9
          -227 -12 -18 -3 -33 -2 -33 3 0 13 184 225 305 352 67 69 118 114 138 120 68
          23 158 30 352 27 164 -3 218 -7 300 -26z m-2830 -10 c182 -17 181 -17 299
          -144 129 -138 306 -346 306 -359 0 -6 -20 -7 -52 -2 -119 16 -285 22 -390 14
          -134 -9 -193 -20 -312 -56 l-88 -27 -17 21 c-9 12 -101 119 -206 238 -104 119
          -191 220 -193 225 -5 14 39 38 103 55 150 40 357 53 550 35z m3634 -625 c25
          -38 100 -177 167 -308 l121 -239 99 109 c54 59 155 170 223 246 68 76 125 136
          127 134 2 -2 64 -124 138 -272 157 -314 211 -405 230 -384 7 8 75 86 152 174
          76 88 169 191 205 230 64 66 68 69 91 56 14 -7 54 -47 88 -88 100 -118 246
          -241 373 -312 31 -18 57 -35 57 -38 0 -8 -66 -84 -233 -273 -76 -85 -152 -172
          -169 -192 l-30 -38 29 -11 c63 -24 224 -59 313 -67 90 -8 250 -3 440 13 l85 8
          -21 -24 c-105 -121 -416 -469 -423 -473 -5 -3 -70 -12 -146 -21 -175 -19 -387
          -19 -501 0 -98 17 -220 51 -228 63 -3 5 79 103 181 218 102 115 198 225 214
          245 l28 36 -22 20 c-12 11 -69 50 -126 88 -105 69 -194 150 -312 284 l-64 74
          -213 -231 c-118 -127 -219 -233 -227 -235 -32 -13 -89 81 -246 401 l-118 243
          -108 -118 c-281 -305 -315 -339 -333 -328 -6 4 -51 87 -100 184 -49 98 -123
          238 -165 310 -41 73 -76 136 -78 140 -1 4 92 114 207 245 239 272 211 259 295
          131z m-4625 -164 l203 -234 -84 -141 c-46 -78 -118 -208 -160 -291 -41 -82
          -84 -165 -95 -183 l-20 -32 -28 22 c-15 13 -79 79 -140 148 -62 69 -147 162
          -188 208 l-75 84 -137 -270 c-132 -261 -199 -372 -224 -372 -14 0 -82 70 -221
          225 -54 61 -127 141 -163 178 l-66 68 -50 -58 c-111 -130 -213 -221 -343 -307
          l-133 -88 19 -27 c10 -14 105 -125 210 -246 105 -121 191 -225 191 -231 0 -22
          -212 -70 -352 -80 -91 -6 -269 5 -438 28 l-85 11 -70 80 c-168 191 -364 421
          -362 424 2 1 68 -5 147 -13 167 -18 438 -13 535 9 95 22 175 47 175 54 0 8
          -49 68 -215 258 -145 166 -205 239 -205 248 0 3 26 20 58 38 109 62 231 161
          349 284 66 69 124 125 130 125 10 0 176 -184 357 -397 43 -51 80 -93 82 -93
          11 0 133 219 235 421 66 132 124 239 129 237 5 -2 104 -110 220 -240 116 -131
          214 -238 220 -238 5 0 52 86 105 191 143 283 242 443 272 437 8 -2 106 -108
          217 -237z m5341 -1177 c119 -142 272 -272 383 -323 31 -15 52 -31 52 -41 0
          -16 -227 -289 -323 -387 -60 -62 -107 -87 -147 -78 -73 16 -248 160 -392 323
          l-100 112 33 38 c110 126 405 452 409 452 3 0 41 -43 85 -96z m-5879 -449
          c-72 -92 -265 -273 -354 -333 -129 -86 -161 -83 -258 20 -64 68 -300 351 -313
          376 -13 24 -5 31 64 61 96 42 246 168 371 312 l85 99 218 -248 218 -247 -31
          -40z" />
              </g>
          </svg>
  
          </div>
      </div>
      `;
  }

  createTrack(cars: Promise<ICar[]>) {
    const trackList = document.querySelector('.trackList') as HTMLElement;
    cars.then((data) => {
      const res = data.map((elem) => this.markupTrack(elem)).join('');
      trackList.innerHTML = res;
    });
  }

  deleteCar(id: string) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
    });
  }

  createCar(name: string, color: string) {
    fetch(`http://127.0.0.1:3000/garage/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
  }

  updateCar(name: string, color: string, id: string) {
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
  }

  carHandler(api: API) {
    const carTracks = document.querySelectorAll('.car-track') as NodeList;

    carTracks.forEach((element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target as HTMLButtonElement;
        const id = (event.target as HTMLElement).parentElement?.nextElementSibling?.id as string;
        const car = (event.target as HTMLElement).parentElement?.nextElementSibling as HTMLElement;

        const btnStart = target.closest('.car-track')?.querySelector('.button-start') as HTMLButtonElement;
        const btnStop = target.closest('.car-track')?.querySelector('.button-stop') as HTMLButtonElement;

        if (target.className === 'button-start') {
          this.engineOperation(id, car, api, btnStart, btnStop);
        }
        if (target.className === 'button-stop') {
          btnStop.disabled = true;
          car?.classList.remove('drive');
          btnStart.disabled = false;
        }
      });
    });
  }

  async engineOperation(
    id: string,
    car: HTMLElement,
    api: API,
    btnStart: HTMLButtonElement,
    btnStop: HTMLButtonElement
  ) {
    btnStart.disabled = true;
    const { velocity, distance } = await api.startEngine(id);
    const time = (distance / velocity / 1000).toFixed(1);
    car?.classList.add('drive');
    car.style.cssText = `animation-duration: ${time}s;`;
    btnStop.disabled = false;

    try {
      const { success } = await api.startDrive(id);
      return { time, success, id };
    } catch (error) {
      if (error instanceof Error) {
        car.style.animationPlayState = 'paused';
        await api.stopEngine(id);
        // console.log(error.message);
      }
    }
  }
}
