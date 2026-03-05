'use strict';
require('dotenv').config();

// ── Shared ─────────────────────────────────────────────────────────────────────
const config = require('./src/shared/config');

// ── Infrastructure ─────────────────────────────────────────────────────────────
const InMemoryQueueRepository = require('./src/infrastructure/persistence/InMemoryQueueRepository');
const YtdlTrackInfoService = require('./src/infrastructure/ytdl/YtdlTrackInfoService');
const DiscordVoiceAudioPlayer = require('./src/infrastructure/discord/adapters/DiscordVoiceAudioPlayer');
const DiscordBot = require('./src/infrastructure/discord/bot/DiscordBot');
const HttpServer = require('./src/infrastructure/http/HttpServer');

// ── Application — Use Cases ────────────────────────────────────────────────────
const PlayTrackUseCase = require('./src/application/music/PlayTrackUseCase');
const StopPlaybackUseCase = require('./src/application/music/StopPlaybackUseCase');
const SkipTrackUseCase = require('./src/application/music/SkipTrackUseCase');
const PausePlaybackUseCase = require('./src/application/music/PausePlaybackUseCase');
const ResumePlaybackUseCase = require('./src/application/music/ResumePlaybackUseCase');
const SetVolumeUseCase = require('./src/application/music/SetVolumeUseCase');
const ToggleLoopUseCase = require('./src/application/music/ToggleLoopUseCase');
const GetQueueUseCase = require('./src/application/music/GetQueueUseCase');
const GetNowPlayingUseCase = require('./src/application/music/GetNowPlayingUseCase');

// ── Composition Root ───────────────────────────────────────────────────────────
// 1. Create the bot first so we have a client reference.
const bot = new DiscordBot(config);

// 2. Wire infrastructure adapters (audio player needs the Discord client).
const queueRepository = new InMemoryQueueRepository();
const trackInfoService = new YtdlTrackInfoService();
const audioPlayer = new DiscordVoiceAudioPlayer(bot.client, queueRepository);

// ─ New ─
const KickUserUseCase = require('./src/application/moderation/KickUserUseCase');
const ReloadCommandUseCase = require('./src/application/admin/ReloadCommandUseCase');
const DiscordGuildMemberAdapter = require('./src/infrastructure/discord/adapters/DiscordGuildMemberAdapter');
const DiscordCommandAdapter = require('./src/infrastructure/discord/adapters/DiscordCommandAdapter');

// 3. Instantiate use cases with injected ports.
const useCases = {
    playTrack: new PlayTrackUseCase(queueRepository, trackInfoService, audioPlayer),
    stopPlayback: new StopPlaybackUseCase(queueRepository, audioPlayer),
    skipTrack: new SkipTrackUseCase(queueRepository, audioPlayer),
    pausePlayback: new PausePlaybackUseCase(queueRepository, audioPlayer),
    resumePlayback: new ResumePlaybackUseCase(queueRepository, audioPlayer),
    setVolume: new SetVolumeUseCase(queueRepository, audioPlayer),
    toggleLoop: new ToggleLoopUseCase(queueRepository),
    getQueue: new GetQueueUseCase(queueRepository),
    getNowPlaying: new GetNowPlayingUseCase(queueRepository),
    kickUser: new KickUserUseCase(new DiscordGuildMemberAdapter(bot.client)),
    reloadCommand: new ReloadCommandUseCase(new DiscordCommandAdapter(bot.client)),
};

// 4. Inject use cases into the client so commands can access them.
bot.client.useCases = useCases;
bot.client.config = config; // some commands read prefix for display purposes

// 5. Start the bot.
bot.run();

// 6. Start the HTTP health server.
const httpServer = new HttpServer(bot.client);
httpServer.start(config.port);
