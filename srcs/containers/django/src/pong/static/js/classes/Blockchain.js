class Blockchain {

	constructor(tournamentId){
		this.tournamentId = tournamentId;
		this.registerMatches();
	}

	async registerMatches() {
		console.log('Tournament ID:', this.tournamentId);
	
		try {
			// Send tournament ID to the server
			const response = await fetch('/api/register_matches/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': this.getCSRFToken() // Include CSRF token for security
				},
				body: JSON.stringify({ tournament_id: this.tournamentId })
			});
	
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
	
			const result = await response.json();
			console.log('Server response:', result);
	
			if (result.success) {
				const txHash = result.tx_hash;
				const etherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
				alert(`Matches registered successfully! Transaction Hash: ${txHash}`);
	
				document.getElementById('transaction-info').innerHTML = 
					`Transaction Hash: <a href="${etherscanUrl}" target="_blank">${txHash}</a>`;
			} else {
				alert('Error registering matches: ' + result.error);
			}
		} catch (error) {
			console.error(error);
			alert('Error registering matches.');
		}
	}

	getCSRFToken() {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				if (cookie.substring(0, 10) === 'csrftoken=') {
					cookieValue = decodeURIComponent(cookie.substring(10));
					break;
				}
			}
		}
		return cookieValue;
	}
}

export { Blockchain };