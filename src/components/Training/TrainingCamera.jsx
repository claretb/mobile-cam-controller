import React, { useEffect, useState } from "react";
import { Button, Alert, Card } from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

export default function TrainingCamera(props) {
	const [isVideoAvailable, setIsVideoAvailable] = useState(true);

	useEffect(() => {
		const getVideo = () => {
			navigator.mediaDevices
				.getUserMedia({
					video: { width: 224, height: 224 },
				})
				.then((stream) => {
					let video = props.videoRef.current;
					video.srcObject = stream;
					video.style.transform = "scale(-1, 1)";
					video.play();
				})
				.catch((err) => {
					console.error(err);
					setIsVideoAvailable(false);
				});
		};
		getVideo();
	}, [props.videoRef]);

	return (
		<>
			<Button
				onClick={() => props.setShowInstructionsAlert(true)}
				variant="primary"
				size="lg"
				className="rounded-circle position-absolute top-10"
				style={{
					fontSize: "3.5vw",
					marginBottom: "1%",
					padding: "0",
					right: "2%",
				}}
			>
				<BsQuestionCircle size={50}></BsQuestionCircle>
			</Button>
			<Card
				className="start-50 translate-middle-x"
				style={{ width: "60%", background: "transparent" }}
			>
				{isVideoAvailable ? (
					<>
						<Button
							disabled={props.buttonDisabled}
							onClick={props.train}
							variant={props.loss === "" ? "success" : "warning"}
							size="lg"
							style={{
								fontSize: "3.5vw",
								marginBottom: "1%",
							}}
						>
							{props.loss === "" ? <>TRAIN</> : props.loss}
						</Button>
						<video
							ref={props.videoRef}
							style={{ width: "100%" }}
							playsInline
							autoPlay
							muted
						></video>
					</>
				) : (
					<Alert
						variant="danger"
						style={{
							fontSize: "3.5vw",
							width: "100%",
							top: "53%",
							marginBottom: "0px",
						}}
					>
						<Alert.Heading>
							Please enable camera access!
						</Alert.Heading>
						<p>
							To use this app, we need to your permission for
							camera access. You can drive the robot car with your
							camera. Please allow it from your browser settings.
						</p>
					</Alert>
				)}
			</Card>
		</>
	);
}
