import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
	const navigate = useNavigate()

	const [keyword, setKeyword] = useState('')

	const clear = () => {
		if (keyword.trim() !== '') {
			setKeyword('')
		}
	}

	const searchHandler = (e) => {
		e.preventDefault()

		if (keyword.trim()) {
			navigate(`/search/${keyword}`)
		} else {
			navigate('/')
		}
	}

	return (
		<form onSubmit={searchHandler}>
			<div className='input-group shadow-sm' style={{ borderRadius: '20px' }}>
				<div className='input-group-prepend'>
					<span className='input-group-text border-0'>
						<i className='fa fa-search' aria-hidden='true'></i>
					</span>
				</div>
				<input
					className='form-control border-0'
					placeholder='Search...'
					type='text'
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<div className='input-group-addon'>
					<button
						type='button'
						className='btn btn-link shadow-none'
						style={{ color: '#ADB5BD' }}
						onClick={clear}
					>
						<i className='fa fa-times'></i>
					</button>
				</div>
			</div>
		</form>
	)
}

export default Search
