#include <ESP8266WiFi.h>
#include <String.h>
#include <PubSubClient.h>
#include "DHT.h"
#include "ArduinoJson.h"

#define DHTPIN 4 
#define DHTTYPE DHT11
#define LDR 5
#define pinOutLed1 14 // D5
#define pinOutLed2 12 // D6
#define wifi_ssid "Kamenriderup"
#define wifi_password "thu789opasd"
#define mqtt_server "broker.mqttdashboard.com"
#define mqtt_user "thuvu"
#define mqtt_password "123456"
#define topic "place/data/sensors"
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient; // init espClient
PubSubClient client(espClient);

// timer
long now = millis();
long lastMeasure = 0;


void setup() {
  pinMode(pinOutLed1, OUTPUT);
  pinMode(pinOutLed2, OUTPUT);
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

// connect to wifi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);
  WiFi.begin(wifi_ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID = "clientId-X1fqWNug71";
    if (client.connect("clientId-X1fqWNug71", mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("turn-led1");
      client.subscribe("turn-led2");
    } else {
      Serial.println("failed, try again in 5 seconds");
      delay(5000);
    }
  }
}
// callback is executed when some device publishes a message to a topic that ESP8266 is subscribed to
void callback(String topic_sub, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic_sub);
    Serial.print("Message:");
    String message = "";
    for (int i = 0; i < length; i++) {
        message = message + (char) payload[i];  // convert *byte to string
    }
  Serial.print(message);
  Serial.println();
  if(topic_sub == "turn-led1"){
    if(message == "on"){
      digitalWrite(pinOutLed1, HIGH);
      Serial.print("on");
    }
    if(message == "off"){
      digitalWrite(pinOutLed1, LOW);
       Serial.print("Off");
    }
  }
  if(topic_sub == "turn-led2"){
    if(message == "on"){
      digitalWrite(pinOutLed2, HIGH);
      Serial.print("on");
    }
    if(message == "off"){
      digitalWrite(pinOutLed2, LOW);
      Serial.print("off");
    }
  }
}


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  now = millis();
  
  if(now - lastMeasure > 5000){
    lastMeasure = now;
    float hum = dht.readHumidity();
    float temp = dht.readTemperature();    
    float lux = analogRead(LDR);    
    if (isnan(hum) || isnan(temp) || isnan(lux)) {
      Serial.println("Failed to read from sensor!");
      return;
    }
    StaticJsonDocument<100> doc;
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["light"] = lux;

    char buffer[100];
    serializeJson(doc, buffer);
    
//    String msg = String(temp) + " " + String(hum) + " " + String(lux);   
    client.publish(topic, buffer, true);
    Serial.printf("Publishing on topic %s \n", topic);
    Serial.printf("Message: %.2f %.2f %.2f\n", temp, hum, lux);
  }
}
