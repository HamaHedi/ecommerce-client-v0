import React from 'react'

const Message = ({ color, message }) => {
	return (
		<div className={`alert alert-${color} text-center mt-4`} role='alert'>
			<span className='alert-icon'>
				<i className='fa fa-exclamation-triangle' aria-hidden='true'></i>
			</span>
			&nbsp;&nbsp;
			<span className='alert-text'>
				<strong>{message}</strong>
			</span>
		</div>
	)
}

export default Message
