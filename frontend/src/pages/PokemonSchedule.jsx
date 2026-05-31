import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader, FiArrowLeft, FiList, FiImage } from 'react-icons/fi';
import { pokemonAPI, submissionsAPI } from '../services/api';

const CURRENT_WEEK = 4;
const ACTIVE_POKEMON_NAME = 'Tapubulu';
const WEEK_LABELS = Array.from({ length: 10 }, (_, index) => index + 1);

const FALLBACK_WEEKS = {
  1: ['Diancie', 'Deoxys', 'Hooh', 'Terrakion', 'Xukitree', 'Poipole', "Jessie's Arbok"],
  2: ['Genesct', 'Lõi Zygarde', 'Groudon', 'Cobalion', "Rocket's Wobbuffet", "Jame's Mareanie", "Agatha's Gengar"],
  3: ['Jirachi', 'Tapukoko', 'Greninja Bond', 'Zeraora', 'tapulele', 'Metagross', 'ASH Sonolax'],
  4: ['Latios', 'Tapufini', 'Keldeo', 'Creslia', 'Tapubulu', "Misty's Psyduck", "Lance's Dragonite"],
  5: ['Latias', 'Sakatakata', 'Thần Gió', 'Buzzwole', 'Heatran', "Jessie's Mimikyu", 'Regigiges'],
  6: ['Pailkia', 'Mashadow', 'Raikou', 'Megeana', 'Meloetta', "Rocket's Mewth"],
  7: ['Zorua', 'Solgalion', 'Blacephanlon', 'Celesteela', 'ASh Haqlucha', "Jame's Weezing", 'Suicun'],
  8: ['Celibi', 'Yveltal', 'Thần Điện', 'Nilihego', 'Thần Đất', 'ASH Thằn lằn cỏ', 'Azelf'],
  9: ['Silvaly', 'Dianlga', 'Xemeas', 'Uxie', 'Kartana', 'Mepist', "Misty's Starnie"],
  10: ['vitini', 'Lunala', 'Vocalion', 'Drakrai', 'Thánh Kiếm cỏ', "Brock's Steelix"],
};

const normalizeResponse = (payload) => {
  const entries = Array.isArray(payload)
    ? payload
    : Object.values(payload || {}).filter((value) => value && typeof value === 'object' && 'name' in value);

  return entries.map((item) => item?.name?.trim()).filter(Boolean);
};

const normalizeName = (name) => String(name || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/['’`]/g, '')
  .replace(/[^a-z0-9]+/g, '');

const isMatchingPokemonName = (left, right) => {
  const leftName = normalizeName(left);
  const rightName = normalizeName(right);

  if (!leftName || !rightName) return false;
  return leftName === rightName || leftName.includes(rightName) || rightName.includes(leftName);
};

const PokemonSchedule = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_WEEK);
  const [weeks, setWeeks] = useState(FALLBACK_WEEKS);
  const [adminPosts, setAdminPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [weekResults, postsResponse] = await Promise.all([
          Promise.allSettled(
            WEEK_LABELS.map(async (week) => {
              const response = await pokemonAPI.getWeek(week);
              return [week, normalizeResponse(response.data)];
            })
          ),
          submissionsAPI.getAdminPosts(200),
        ]);

        const nextWeeks = { ...FALLBACK_WEEKS };
        weekResults.forEach((result, index) => {
          const week = index + 1;
          if (result.status === 'fulfilled' && result.value[1].length > 0) {
            nextWeeks[week] = result.value[1];
          }
        });

        setWeeks(nextWeeks);
        setAdminPosts(postsResponse.data.data || []);
      } catch (error) {
        console.error('Load pokemon schedule error:', error);
        setWeeks(FALLBACK_WEEKS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedItems = weeks[selectedWeek] || [];

  const getPokemonImageByName = (name) => {
    const found = [...adminPosts]
      .filter((post) => post.file?.url && isMatchingPokemonName(post.name, name))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    return found?.file?.url || null;
  };

  return (
    <div className="min-h-screen bg-[#0b0d16] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 text-[13px] font-medium text-white/70">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 transition hover:bg-white/10"
          >
            <FiArrowLeft />
            Trang ban đầu
          </button>

          <button
            type="button"
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 transition hover:bg-white/10"
          >
            <FiList />
            Bảng xếp hạng
          </button>
        </div>

        <header className="pt-8 text-center sm:pt-10">
          <h1 className="text-[clamp(2rem,5vw,3.6rem)] font-black tracking-[-0.05em] text-white">
            Lịch Rút x10 Poke Đại Chiến
          </h1>

          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {WEEK_LABELS.map((week) => {
              const isActive = selectedWeek === week;

              return (
                <button
                  key={week}
                  type="button"
                  onClick={() => setSelectedWeek(week)}
                  className={`min-w-[68px] rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isActive
                      ? 'border-[#ff7d78] bg-gradient-to-b from-[#ff5b6a] to-[#d9378f] text-white'
                      : 'border-white/8 bg-white/6 text-white/65 hover:border-white/15 hover:bg-white/10'
                    }`}
                >
                  Tuần {week}
                </button>
              );
            })}
          </div>
        </header>

        <main className="mt-8 flex-1 pb-4">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center text-white/70">
                <FiLoader className="mx-auto animate-spin text-4xl" />
                <p className="mt-4 text-sm">Đang tải lịch...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {selectedItems.map((name, index) => {
                const imageUrl = getPokemonImageByName(name);
                const isActivePokemon = selectedWeek === CURRENT_WEEK && isMatchingPokemonName(name, ACTIVE_POKEMON_NAME);
                const cardTone = isActivePokemon
                  ? 'opacity-100 scale-[1.01] saturate-150 brightness-110 shadow-[0_22px_50px_rgba(53,167,255,0.28)]'
                  : 'opacity-45 grayscale-[0.35] brightness-75';

                return (
                  <article
                    key={`${selectedWeek}-${name}-${index}`}
                    className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-[#7c1e22]/80 to-[#4a1316]/80 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm transition duration-300 ${cardTone}`}
                  >
                    {isActivePokemon ? (
                      <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#35a7ff] shadow-[0_0_0_4px_rgba(53,167,255,0.18)]" />
                    ) : null}

                    <div className="flex h-[130px] w-full items-center justify-center bg-white/5 p-6">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="h-[88px] w-[88px] object-contain"
                        />
                      ) : (
                        <FiImage className="text-4xl text-white/70" />
                      )}
                    </div>

                    <div className="border-t border-white/10 px-4 py-3 text-center">
                      <h3 className="truncate text-sm font-bold text-white">{name}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PokemonSchedule;