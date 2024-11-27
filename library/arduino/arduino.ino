#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

Servo servoPlastic;  // Servo for plastic
Servo servoMetal;    // Servo for metal
Servo servoPaper;    // Servo for paper
Servo servoWaste;    // Servo for general waste

const int pinPlastic = 9;  // Pin for plastic servo
const int pinMetal = 10;   // Pin for metal servo
const int pinPaper = 11;   // Pin for paper servo
const int pinWaste = 12;   // Pin for general waste servo

// Initialize LCD with I2C address (0x27 is a common address, 20x4 LCD with 20 columns and 4 rows)
LiquidCrystal_I2C lcd(0x27, 20, 4);

void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // Attach servos to their respective pins
  servoPlastic.attach(pinPlastic);
  servoMetal.attach(pinMetal);
  servoPaper.attach(pinPaper);
  servoWaste.attach(pinWaste);

  // Set initial servo positions
  servoPlastic.write(0);
  servoMetal.write(0);
  servoPaper.write(0);
  servoWaste.write(0);

  // Initialize LCD
  lcd.begin(20, 4);  // Initialize the LCD
  lcd.backlight();   // Turn on the backlight

  // Display "Scanning" by default on the LCD
  lcd.setCursor(0, 0);  // Set cursor to the first row, first column
  lcd.print("Scanning...");  // Default text

  Serial.println("Servo waste segregation system initialized.");
}

void loop() {
  // Check if there is incoming data
  if (Serial.available() > 0) {
    // Read and trim the incoming data
    String input = Serial.readStringUntil('\n');
    input.trim(); // Remove any extra whitespace or newline characters
    Serial.println("Received: " + input);

    // Update LCD and act based on the input
    lcd.clear();  // Clear previous messages on the LCD
    lcd.setCursor(0, 0);  // Set cursor to the first row

    if (input == "plastic") {
      lcd.print("Plastic detected");
      Serial.println("Moving plastic servo");
      moveServo(servoPlastic);
    } 
    else if (input == "metal") {
      lcd.print("Metal detected");
      Serial.println("Moving metal servo");
      moveServo(servoMetal);
    } 
    else if (input == "paper") {
      lcd.print("Paper detected");
      Serial.println("Moving paper servo");
      moveServo(servoPaper);
    } 
    else if (input == "waste") {
      lcd.print("General waste");
      Serial.println("Moving waste servo");
      moveServo(servoWaste);
    } 
    else {
      lcd.print("Unknown input");
      Serial.println("Unknown input");
    }
  }
}

// Function to move a servo to 180 degrees and reset to 0
void moveServo(Servo &servo) {
  servo.write(180);  // Move servo to 180 degrees
  delay(5000);       // Wait for 5 second to allow the movement
  servo.write(0);    // Reset to 0 degrees

  // Clear the LCD and show "Scanning..."
  delay(1000);  // Wait for half a second to let the user see the servo action
  lcd.clear(); // Clear the screen
  lcd.setCursor(0, 0);  // Set cursor to the first row
  lcd.print("Scanning...");  // Default text after servo action
}
