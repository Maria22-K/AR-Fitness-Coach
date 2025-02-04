from flask import Flask, render_template, Response
import cv2
import mediapipe as mp

app = Flask(__name__)

# MediaPipe Pose Detection
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Kamera initialisieren
camera = cv2.VideoCapture(0)

# Zählvariablen initialisieren
squat_count = 0
position = "up"

def generate_frames():
    global squat_count, position

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Konvertiere das Bild in RGB (MediaPipe benötigt RGB)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(frame_rgb)

            if results.pose_landmarks:
                # Zeichne die Pose-Punkte auf das Bild
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Kniebeugen-Erkennung hinzufügen
                landmarks = results.pose_landmarks
                hip_y = landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].y
                knee_y = landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE].y

                if "squat_count" not in globals():
                    squat_count = 0
                if "position" not in globals():
                    position = "up"

                # Kniebeugen zählen: Hüfte unterhalb des Knies
                if hip_y > knee_y:
                    if position == "up":
                        squat_count += 1
                        position = "down"
                else:
                    position = "up"

                # Kniebeugen-Zähler auf dem Kamerabild anzeigen
                cv2.putText(frame, f'Kniebeugen: {squat_count}', (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

            # Konvertiere das Bild zurück in Bytes
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)