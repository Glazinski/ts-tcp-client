import net from 'net';

export class TcpClient {
    private socket: net.Socket;
    private isSocketConnected: boolean;

    constructor(private port: number, private addr: string) {
        this.isSocketConnected = false;
    }

    private addListeners = (): void => {
        if (this.socket) {
            this.socket.on('close', () => {
                console.log('Connection closed');
            });

            this.socket.on('connect', () => {
                console.log('Client connected');
            });

            this.socket.on('ready', () => {
                console.log('Socket is ready to be used');
            });

            this.socket.on('end', () => {
                console.log('Server stopped the connection');
            });

            this.socket.on('error', (error: Error) => {
                console.log('Something went wrong', error);
            });
        }
    };

    private connect = (): void => {
        if (!this.isSocketConnected) {
            console.log('Conecting...');
            try {
                this.socket.connect(this.port, this.addr);
            } catch (error) {
                console.log('Connection error', error);
            }
        } else {
            console.log('Socket is already connected');
        }
    };

    send = (buffer: string): void => {
        if (this.socket) {
            // this.socket.write(buffer);
            this.socket.write(Buffer.from(buffer));
        }
    };

    close = (): void => {
        if (this.socket) {
            this.socket.destroy();
            this.socket = null;
        }
    };

    createSocket = (): void => {
        if (!this.socket) {
            this.socket = new net.Socket();
        }
    };

    init = (): void => {
        this.createSocket();
        this.addListeners();
        this.connect();
    };
}
