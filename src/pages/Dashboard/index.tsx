import React, { FormEvent, useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'
import api from '../../services/api'

import { Title, Form, Repositories, Error } from './styles'

interface Repository {
  id: number
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])

  async function addRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositorio')
      return
    }
    try {
      const res = await api.get<Repository>(`repos/${newRepo}`)

      const repository = res.data

      setRepositories([...repositories, repository])
      setNewRepo('')
      setInputError('')
    } catch (err) {
      setInputError(`Erro na busca pelo repositorio: ${newRepo}`)
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore Repositorios no Github</Title>

      <Form hasError={!!inputError} onSubmit={addRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o nome do repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(({ id, owner, full_name, description }) => (
          <a key={id} href="teste">
            <img src={owner.avatar_url} alt={owner.login} />
            <div>
              <strong>{full_name}</strong>
              <p>{description}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard
