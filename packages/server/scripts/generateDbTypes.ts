/// <reference types="node" />
import {execSync} from 'child_process'

const main = () => {
  try {
    console.log('Generating database types...')
    execSync('kanel -c ./scripts/kanelfile.js', {stdio: 'inherit'})
    console.log('Database types generated successfully')
  } catch (error) {
    console.error('Failed to generate database types:', error)
    process.exit(1)
  }
}

main()
