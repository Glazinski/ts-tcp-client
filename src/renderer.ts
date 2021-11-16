import { ipcRenderer } from 'electron';

class Renderer {
    private sendBtn: HTMLButtonElement;
    private selectedFile: File;

    constructor() {
        this.sendBtn = document.querySelector('.send-btn');
    }

    handleClick = () => {
        // this.selectedFile = (<HTMLInputElement>(
        //     document.querySelector('.file-input')
        // )).files[0];

        // console.log('Button here', this.selectedFile);
        ipcRenderer.send('send-file', 'HEY');
    };

    init = (): void => {
        this.sendBtn.addEventListener('click', this.handleClick);
    };
}

const renderer = new Renderer();
renderer.init();
