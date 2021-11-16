import net from 'net';

export class TcpClient {
    private socket: net.Socket;

    constructor(private port: number, private addr: string) {}

    connect = (): void => {
        // this.socket.connect({
        //     port: this.port,
        //     host: this.addr,
        //     family: 4,
        // });
        this.socket.connect(this.port, this.addr, () => {
            console.log('CONNECTED');
            this.socket.write('HEY');
        });
    };

    send = (buffer: string): void => {
        if (this.socket) {
            this.socket.write(buffer);
        }
    };

    // handleData = (chunk: Buffer): void => {
    //     try {
    //         console.log('chunk', chunk);
    //     } catch (error: unknown) {
    //         console.log('data error', error);
    //     }
    // };

    init = (): void => {
        if (!this.socket) {
            this.socket = new net.Socket();
            this.socket.on('data', (data: Buffer) => {
                console.log(data);
            });
            // this.socket.on('data', this.handleData);
        }
    };
}
