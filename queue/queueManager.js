import Queue from 'bull';
import { ENV } from '../src/config/constant';

const redisConfig = {
  host: '127.0.0.1',
  port: 6379,
  // password: 'your_redis_password',
};

class QueueManager {
  constructor() {
    this.queues = {};
  }

  getQueue(queueName) {
    if (!this.queues[queueName]) {
      const queue = new Queue(queueName, { redis: redisConfig });

      if (ENV == "production") {
        // Attach event listeners for debugging
        queue.on('error', (err) => {
          console.error(`❌ Queue "${queueName}" error:`, err);
        });
  
        queue.on('failed', (job, err) => {
          console.error(`❌ Queue "${queueName}" failed job ${job.id}:`, err.message);
        });
      }

      this.queues[queueName] = queue;
    }
    return this.queues[queueName];
  }

  addJob(queueName, jobName, data, options = {}) {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data, options);
  }

  process(queueName, jobName, processor) {
    const queue = this.getQueue(queueName);
    queue.process(jobName, processor);
  }
}

const queueManager = new QueueManager();
export default queueManager;
