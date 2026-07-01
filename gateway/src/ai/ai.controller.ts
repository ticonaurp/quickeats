import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat.dto';
import { AiChatResponse } from './interfaces/ai-response.interface';

@Controller('ai') // http://localhost:3001/ai
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequestDto): Promise<AiChatResponse> {
    return this.aiService.chat(body);
  }
}
