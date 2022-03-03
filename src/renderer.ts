import { ipcRenderer } from 'electron';

class Renderer {
  private generateBtn: HTMLButtonElement;
  private resultSection: HTMLDivElement;
  private sizeSection: HTMLDivElement;
  private portInput: HTMLInputElement;
  private addressInput: HTMLInputElement;

  constructor() {
    this.generateBtn = document.querySelector('.generate-btn');
    this.resultSection = document.querySelector('.result-section');
    this.sizeSection = document.querySelector('.size-section');
    this.portInput = document.querySelector('.port-input');
    this.addressInput = document.querySelector('.address-input');
  }

  private calcStringSizeInBits = (str: string): number => str.length * 8;
  private calcStringSizeInKilobit = (str: string): number => str.length / 1000;

  private generateRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min) + min);

  private clearDom = (): void => {
    this.resultSection.innerHTML = '';
    this.sizeSection.innerHTML = '';
  };

  private fetch = async () => {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/posts?&_limit=${this.generateRandomNumber(
        1,
        100
      )}`
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));

    return data;
  };

  private handleClick = async () => {
    this.clearDom();
    const port = this.portInput.value;
    const address = this.addressInput.value;
    const data = await this.fetch();
    const serializedData = JSON.stringify(data);
    this.resultSection.insertAdjacentHTML(
      'beforeend',
      `
                <pre>
                ${JSON.stringify(data, undefined, 4)}
                </pre>
            `
    );
    this.sizeSection.insertAdjacentHTML(
      'afterbegin',
      `
                <h4>Rozmiar w b:  ${this.calcStringSizeInBits(
                  serializedData
                )}</h4>
                <h4>Rozmiar w B: ${serializedData.length}</h4>
                <h4>Rozmiar w kB: ${this.calcStringSizeInKilobit(
                  serializedData
                )}</h4
            `
    );
    ipcRenderer.send('send-json', {
      port: parseInt(port, 10),
      address,
      size: `${serializedData.length + 1}`,
      serializedData: serializedData + '\0',
    });
  };

  private addListeners = (): void => {
    this.generateBtn.addEventListener('click', this.handleClick);
  };

  init = (): void => {
    this.fetch();
    this.addListeners();
  };
}

const renderer = new Renderer();
renderer.init();
