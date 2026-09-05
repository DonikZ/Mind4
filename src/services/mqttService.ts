import mqtt, { MqttClient } from 'mqtt';
import { Machine } from '../types';

export interface MqttConfig {
  url: string;
  username?: string;
  password?: string;
  topic: string;
}

export type MqttMessageCallback = (topic: string, payload: any) => void;
export type MqttConnectionCallback = (connected: boolean) => void;

class MqttService {
  private client: MqttClient | null = null;
  private config: MqttConfig | null = null;
  private messageCallbacks: MqttMessageCallback[] = [];
  private connectionCallbacks: MqttConnectionCallback[] = [];

  public connect(config: MqttConfig): Promise<void> {
    this.config = config;
    
    if (this.client) {
      this.client.end();
    }

    return new Promise((resolve, reject) => {
      try {
        const options: mqtt.IClientOptions = {
          keepalive: 60,
          protocolId: 'MQTT',
          protocolVersion: 4,
          clean: true,
          reconnectPeriod: 5000,
          connectTimeout: 30 * 1000,
        };

        if (config.username) options.username = config.username;
        if (config.password) options.password = config.password;

        this.client = mqtt.connect(config.url, options);

        this.client.on('connect', () => {
          console.log(`Connected to MQTT broker at ${config.url}`);
          this.notifyConnectionState(true);
          if (this.client) {
             this.client.subscribe(config.topic, { qos: 0 }, (err) => {
               if (err) {
                 console.error('MQTT Subscribe error:', err);
               } else {
                 console.log(`Subscribed to topic: ${config.topic}`);
               }
             });
          }
          resolve();
        });

        this.client.on('reconnect', () => {
          console.log('Reconnecting to MQTT broker...');
          this.notifyConnectionState(false);
        });

        this.client.on('close', () => {
          console.log('Disconnected from MQTT broker');
          this.notifyConnectionState(false);
        });

        this.client.on('offline', () => {
          console.log('MQTT client offline');
          this.notifyConnectionState(false);
        });

        this.client.on('error', (err) => {
          console.error('MQTT Connection error:', err);
          this.notifyConnectionState(false);
          reject(err);
        });

        this.client.on('message', (topic, message) => {
          try {
            const payload = JSON.parse(message.toString());
            this.messageCallbacks.forEach(cb => cb(topic, payload));
          } catch (e) {
            console.error('Failed to parse MQTT message payload as JSON', e);
          }
        });

      } catch (err) {
        console.error('MQTT setup error:', err);
        reject(err);
      }
    });
  }

  private notifyConnectionState(connected: boolean) {
    this.connectionCallbacks.forEach(cb => cb(connected));
  }

  public disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.notifyConnectionState(false);
      console.log('Disconnected from MQTT broker manually');
    }
  }

  public isConnected(): boolean {
    return this.client?.connected || false;
  }

  public onConnectionChange(callback: MqttConnectionCallback) {
    this.connectionCallbacks.push(callback);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  public subscribeToMessages(callback: MqttMessageCallback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const mqttService = new MqttService();
