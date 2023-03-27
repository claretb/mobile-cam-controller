import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";

import Camera from "./Camera";
import { addSampleHandler, train } from "../services/ModelServices";

export default function Training() {
	const videoRef = useRef(null);
	const forwardPhotoRef = useRef(null);
	const leftPhotoRef = useRef(null);
	const rightPhotoRef = useRef(null);
	const backPhotoRef = useRef(null);

	const [forwardSampleCount, setForwardSampleCount] = useState(0);
	const [leftSampleCount, setLeftSampleCount] = useState(0);
	const [rightSampleCount, setRightSampleCount] = useState(0);
	const [backSampleCount, setBackSampleCount] = useState(0);

	const [learningRate, setLearningRate] = useState(0.0001);
	const [batchSize, setBatchSize] = useState(0.4);
	const [epochs, setEpochs] = useState(20);
	const [hiddenUnits, setHiddenUnits] = useState(100);

	const [showDataAlert, setShowDataAlert] = useState(false);
	const [showBatchSizeAlert, setShowBatchSizeAlert] = useState(false);
	const [loss, setLoss] = useState("");

	const handleLearningRate = (e) => {
		setLearningRate(e.target.value);
	};

	const handleBatchSize = (e) => {
		setBatchSize(e.target.value);
	};

	const handleEpochs = (e) => {
		setEpochs(e.target.value);
	};

	const handleHiddenUnits = (e) => {
		setHiddenUnits(e.target.value);
	};

	const handleTrain = () => {
		train(
			learningRate,
			batchSize,
			epochs,
			hiddenUnits,
			setLoss,
			setShowDataAlert,
			setShowBatchSizeAlert
		);
	};

	const addSample = (position) => {
		const width = 224;
		const height = 224;

		// Label for model training.
		// 0: Forward, 1: Back, 2: Left, 3: Right
		let label;
		let photo;
		if (position === "forward") {
			label = 0;
			photo = forwardPhotoRef.current;
			setForwardSampleCount(forwardSampleCount + 1);
		} else if (position === "left") {
			label = 2;
			photo = leftPhotoRef.current;
			setLeftSampleCount(leftSampleCount + 1);
		} else if (position === "right") {
			label = 3;
			photo = rightPhotoRef.current;
			setRightSampleCount(rightSampleCount + 1);
		} else {
			label = 1;
			photo = backPhotoRef.current;
			setBackSampleCount(backSampleCount + 1);
		}

		let video = videoRef.current;
		photo.width = width;
		photo.height = height;

		let ctx = photo.getContext("2d");
		ctx.drawImage(video, 0, 0, width, height);

		addSampleHandler(video, label);
	};

	if (showDataAlert) {
		return (
			<Alert
				variant="danger"
				onClose={() => setShowDataAlert(false)}
				dismissible
			>
				<Alert.Heading>Oh, you got an error!</Alert.Heading>
				<p>Please add some examples before training.</p>
			</Alert>
		);
	} else if (showBatchSizeAlert) {
		return (
			<Alert
				variant="danger"
				onClose={() => setShowBatchSizeAlert(false)}
				dismissible
			>
				<Alert.Heading>Oh, you got an error!</Alert.Heading>
				<p>
					Batch size is 0 or NaN. Please choose a non-zero fraction.
				</p>
			</Alert>
		);
	} else {
		return (
			<>
				<Card className="position-absolute" style={{ width: "30%" }}>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						LEARNING RATE
					</Card.Text>
					<Form.Select
						defaultValue="0.0001"
						onChange={handleLearningRate}
						size="sm"
					>
						<option value="0.00001">0.00001</option>
						<option value="0.0001">0.0001</option>
						<option value="0.001">0.001</option>
						<option value="0.003">0.003</option>
					</Form.Select>
				</Card>

				<Card
					className="position-absolute start-50 translate-middle-x"
					style={{ width: "25%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						GO FORWARD
					</Card.Text>
					<canvas
						ref={forwardPhotoRef}
						style={{
							width: "100%",
							height: "25vw",
							backgroundColor: "black",
						}}
					></canvas>
					<Card.Text style={{ marginTop: "0px", fontSize: "2vw" }}>
						{forwardSampleCount} examples.
					</Card.Text>
					<Button
						onClick={() => addSample("forward")}
						className="stretched-link"
						size="sm"
						style={{
							fontSize: "2.9vw",
							marginTop: "-17px",
							backgroundColor: "steelblue",
							borderColor: "steelblue",
						}}
					>
						ADD SAMPLE
					</Button>
				</Card>

				<Card
					className="position-absolute end-0"
					style={{ width: "30%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						BATCH SIZE
					</Card.Text>
					<Form.Select
						defaultValue="0.4"
						onChange={handleBatchSize}
						size="sm"
					>
						<option value="0.05">0.05</option>
						<option value="0.1">0.1</option>
						<option value="0.4">0.4</option>
						<option value="1">1</option>
					</Form.Select>
				</Card>

				<Card
					className="position-absolute start-0 translate-middle-y"
					style={{ width: "25%", top: "53%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						TURN LEFT
					</Card.Text>
					<canvas
						ref={leftPhotoRef}
						style={{
							width: "100%",
							height: "25vw",
							backgroundColor: "black",
						}}
					></canvas>
					<Card.Text style={{ marginTop: "0px", fontSize: "2vw" }}>
						{leftSampleCount} examples.
					</Card.Text>
					<Button
						onClick={() => addSample("left")}
						className="stretched-link"
						size="sm"
						style={{
							fontSize: "2.9vw",
							marginTop: "-17px",
							backgroundColor: "steelblue",
							borderColor: "steelblue",
						}}
					>
						ADD SAMPLE
					</Button>
				</Card>

				<Camera videoRef={videoRef} train={handleTrain} loss={loss} />

				<Card
					className="position-absolute end-0 translate-middle-y"
					style={{ width: "25%", top: "53%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						TURN RIGHT
					</Card.Text>
					<canvas
						ref={rightPhotoRef}
						style={{
							width: "100%",
							height: "25vw",
							backgroundColor: "black",
						}}
					></canvas>
					<Card.Text style={{ marginTop: "0px", fontSize: "2vw" }}>
						{rightSampleCount} examples.
					</Card.Text>
					<Button
						onClick={() => addSample("right")}
						className="stretched-link"
						size="sm"
						style={{
							fontSize: "2.9vw",
							marginTop: "-17px",
							backgroundColor: "steelblue",
							borderColor: "steelblue",
						}}
					>
						ADD SAMPLE
					</Button>
				</Card>

				<Card
					className="position-absolute start-0"
					style={{ width: "30%", bottom: "0%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						EPOCHS
					</Card.Text>
					<Form.Select
						defaultValue="20"
						onChange={handleEpochs}
						size="sm"
					>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="40">40</option>
					</Form.Select>
				</Card>

				<Card
					className="position-absolute bottom-0 start-50 translate-middle-x"
					style={{ width: "25%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						GO BACK
					</Card.Text>
					<canvas
						ref={backPhotoRef}
						style={{
							width: "100%",
							height: "25vw",
							backgroundColor: "black",
						}}
					></canvas>
					<Card.Text style={{ marginTop: "0px", fontSize: "2vw" }}>
						{backSampleCount} examples.
					</Card.Text>
					<Button
						onClick={() => addSample("back")}
						className="stretched-link"
						size="sm"
						style={{
							fontSize: "2.9vw",
							marginTop: "-17px",
							backgroundColor: "steelblue",
							borderColor: "steelblue",
						}}
					>
						ADD SAMPLE
					</Button>
				</Card>

				<Card
					className="position-absolute end-0"
					style={{ width: "30%", bottom: "0%" }}
				>
					<Card.Text
						style={{ fontSize: "2.9vw", marginBottom: "0px" }}
					>
						HIDDEN UNITS
					</Card.Text>
					<Form.Select
						defaultValue="100"
						onChange={handleHiddenUnits}
						size="sm"
					>
						<option value="10">10</option>
						<option value="100">100</option>
						<option value="200">200</option>
					</Form.Select>
				</Card>
			</>
		);
	}
}
