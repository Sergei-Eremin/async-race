export class Race {
    generateButtons() {
        const block = `
        <div class="fields__buttons">
          <button class="fields__button fields__button-start">Race</button>
          <button class="fields__button fields__button-reset">Reset</button>
          <button class="fields__button fields__button-generate">Generate Cars</button>
        </div>
        `;
        return block;
    }
}
