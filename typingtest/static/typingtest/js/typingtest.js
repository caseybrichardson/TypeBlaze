var TypingTest = function(testTextLabel, inputField, wpmElement) {
	var self = this;
	// Saving variables for future
	this.testTextLabel = testTextLabel;
	this.inputField = inputField;
	this.wpmElement = wpmElement;

	// Tracking time
	this.startedTyping = false;
	this.currentWPM = 0;
	this.startTime = 0;
	this.currentTime = 0;
	this.totalTime = 0;
	this.timeConversion = 1000;
	this.updateTime = 1000;

	// Breaking and tracking the text
	this.splitText = this.testTextLabel.text().split(' ');
	this.currentWordIndex = 1;
	this.currentStartLocation = 0;

	this.doneHandler = null;
	this.doneCalled = false;
	this.intervalId = -999;

	// Adding a property to the test
	Object.defineProperty(this, 'done', {
		get: function() {
			return self.currentWordIndex > self.splitText.length;
		}
	});

	// Assigns a completion handler to the test
	this.onTestCompletion = function(handler) {
		if(handler) {
			self.doneHandler = handler;
		}
	}

	// Updating the fields
	this.updateFields = function() {
		if(self.currentWordIndex < self.splitText.length) {
			var text = self.testTextLabel.text();

			var occurenceFirstIndex = text.indexOf(' ', self.currentWordIndex - 1);
			if(self.currentWordIndex - 1 == 0) {
				occurenceFirstIndex = 0;
			}

			var occurenceSecondIndex = text.indexOf(' ', self.currentWordIndex);

			var textBefore = text.substring(0, occurenceFirstIndex);
			var textHighlight = text.substring(occurenceFirstIndex, occurenceSecondIndex);
			var textAfter = text.substring(occurenceSecondIndex, text.length);
			
			self.testTextLabel.html(textBefore + '<em>' + textHighlight + '</em>' + textAfter);
			self.inputField.val('');
		}
	}

	// Using this to setup and avoid context issues
	this.updateFields();

	// Calculating the current words per minute
	this.updateWPM = function() {
		if(self.startedTyping && !self.done) {
			self.currentTime = ($.now() / self.timeConversion);
			var time = self.currentTime - self.startTime;
			var ratio = 60 / time;
			self.currentWPM = Math.round(self.currentWordIndex * ratio)
			self.wpmElement.text(self.currentWPM + ' wpm');
		}
	}

	// Saving the results to the server
	this.saveResults = function() {

	}

	// Monitoring of the input keyup event
	this.inputField.keyup(function(event) {

		if(!self.done) {
			if(!self.startedTyping) {
				self.startTime = ($.now() / self.timeConversion);
				self.currentTime = self.startTime;
				self.startedTyping = true;
			}

			var keycode = event.keycode ? event.keycode : event.which;
			if(keycode == 32) {
				var inputText = self.inputField.val();
				var matchText = self.splitText[self.currentWordIndex - 1];
				var sliced = inputText.slice(0, -1);
				if(inputText.slice(0, -1) == matchText) {
					self.updateFields();
					self.currentWordIndex++;
					self.updateWPM();
				}
			}
		}

		if(self.done && !self.doneCalled) {
			self.totalTime = self.currentTime - self.startTime;
			if(self.intervalId != -999) {
				clearInterval(self.intervalId);
			}

			self.inputField.val('');
			self.inputField.disabled = true;
			self.doneCalled = true;

			if(self.doneHandler) {
				self.doneHandler(self.totalTime, self.currentWPM);
			}
		}
	});

	// Update the wpm on a regular interval
	this.intervalId = setInterval(this.updateWPM, this.updateTime);
}