/**
 * Marian Antiphons GABC
 *
 * Four seasonal antiphons sung after Compline:
 * - Alma Redemptoris Mater (Advent 1 → Feb 2)
 * - Ave Regina Caelorum (Feb 2 → Easter)
 * - Regina Caeli Laetare (Easter → Trinity)
 * - Salve Regina (Trinity → Advent 1)
 *
 * Each antiphon has associated versicle(s) and prayer(s).
 * Alma Redemptoris has two variants: Advent and Christmas.
 */

export default {
  // Alma Redemptoris Mater (Advent 1 Vespers → Feb 2)
  "alma-redemptoris-mater": `name:Alma Redemptoris;
mode:5;
%%
(c4) Al(c/ef/gh)ma(g) *() Re(g)dem(g)ptó(h)ris(i) Ma(j)ter,(g) (;) quæ(e) pér(e)vi(e)a(f) cæ(e)li(d) por(e)ta(f) ma(h)nes,(g) (,) et(h) stel(j)la(i) ma(h)ris,(g) (;) suc(e)cúr(f)re(e) ca(d)dén(e)ti(g) (,) súr(e)ge(f)re(g) qui(h) cu(j)rat(i) pó(k)pu(j)lo:(j) (:) Tu(j) quæ(i) ge(j)nu(j)í(k)sti,(g) (,) na(j)tú(i)ra(h) mi(g)rán(f)te,(e) (,) tu(e)um(e) san(h)ctum(g) Ge(f)ni(e)tó(de)rem,(fe) (:) Vir(j)go(i) pri(h)us(g) ac(h) po(g)sté(e)ri(f)us,(g) (;) Ga(h)bri(h)é(j)lis(h) ab(g) o(f)re(e) (,) su(f)mens(e) il(g)lud(g) A(h)ve,(g) (;) pec(j)ca(i)tó(j)rum(hg) mi(h)se(f)ré(ed)re.(c) (::)`,

  "alma-redemptoris-versicle-advent": `initial-style: 1;
%%
(c3)An(h)ge(h)lus(h) Do(h)mi(h)ni(h) nun(h)ti(h)a(h)vit(h) Ma(h)ri(h)æ.(f) <i>R.</i> (::)
Et(h) con(h)ce(h)pit(h) de(h) Spi(h)ri(h)tu(h) San(h)cto.(f) (::)`,

  "alma-redemptoris-prayer-advent": `initial-style: 1;
%%
(c3)O(h)re(h)mus.(f) (::)
Gra(h)ti(h)am(h) tu(h)am,(h) quae(h)su(h)mus,(h) Do(h)mi(h)ne,(h) men(h)ti(h)bus(h) no(h)stris(h) in(h)fun(h)de:(f) (;) ut(h) qui,(h) An(h)ge(h)lo(h) nun(h)ti(h)an(h)te,(h) Chri(h)sti(h) Fi(h)li(h)i(h) tu(h)i(h) in(h)car(h)na(h)ti(h)o(h)nem(g) co(f)gno(h)vi(h)mus;(h) (:) per(h) pas(h)si(h)o(h)nem(h) e(h)ius(h) et(h) cru(h)cem,(h) ad(h) re(h)sur(h)re(h)cti(h)o(h)nis(h) glo(h)ri(h)am(h) per(h)du(h)ca(h)mur.(f) (:) Per(h) e(h)un(h)dem(h) Chri(h)stum(h) Do(h)mi(h)num(h) no(h)strum.(h) <i>R.</i> (::)
A(g.)men.(h.) (::)`,

  "alma-redemptoris-versicle-christmas": `initial-style: 1;
%%
(c3)Post(h) par(h)tum,(h) Vir(h)go,(h) in(h)vi(h)o(h)la(h)ta(h) per(h)man(h)si(h)sti.(f)  <i>R.</i> (::)
De(h)i(h) Ge(h)ni(h)trix,(h) in(h)ter(h)ce(h)de(h) pro(h) no(h)bis.(f) (::)`,

  "alma-redemptoris-prayer-christmas": `initial-style: 1;
%%
(c3)O(h)re(h)mus.(f) (::)
De(h)us,(h) qui(h) sa(h)lu(h)tis(h) ae(h)ter(h)nae,(h) be(h)a(h)tae(h) Ma(h)ri(h)ae(h) vir(h)gi(h)ni(h)ta(h)te(h) fe(h)cun(h)da,(h) hu(h)ma(h)no(h) ge(h)ne(h)ri(h) prae(h)mi(h)a(h) prae(h)sti(h)ti(h)sti:(g) (;) tri(h)bu(h)e,(h) quae(h)su(h)mus;(h) ut(h) i(h)psam(h) pro(h) no(h)bis(h) in(h)ter(h)ce(h)de(h)re(h) sen(g)ti(f)a(h)mus,(h) (;) per(h) quam(h) me(h)ru(h)i(h)mus(h) au(h)cto(h)rem(h) vi(h)tae(h) su(h)sci(h)pe(h)re,(h) Do(h)mi(h)num(h) no(h)strum(h) Ie(h)sum(h) Chri(h)stum,(h) Fi(h)li(h)um(h) tu(h)um.(f) <i>R.</i> (::)
A(g.)men.(h.) (::)`,

  // Ave Regina Caelorum (Feb 2 → Easter Vigil)
  "ave-regina-caelorum": `name:Ave Regina caelorum (simple tone);
mode:6;
%%
(c4) A(f)ve(e) Re(d)gí(c)na(d) cae(f)ló(g)rum,(f.) *(;) A(h)ve(j) Dó(ixi)mi(g)na(h) An(g)ge(f)ló(h)rum :(g.) (;) Sal(f)ve(e) ra(d)dix,(c) sal(d)ve(f) por(g)ta,(f_) (;) Ex(h) qua(g) mun(ixi)do(h) lux(g) est(d) or(g)ta :(f.) (:) Gau(f)de(g) Vir(h)go(h) glo(g)ri(h)ó(ixi)sa,(h_) (;) Su(j)per(ixi) o(h)mnes(g) spe(f)ci(d)ó(g)sa :(f.) (:) Va(ixi)le,(h) o(g) val(ixi)de(h) de(g)có(f!gwh)ra,(h.) (;) Et(j) pro(ixi) no(ixijk)bis(h_) Chri(h)stum(g) ex(f)ó(gg)ra.(f.) (::)`,

  "ave-regina-versicle": `initial-style: 1;
%%
(c3)Di(h)gna(h)re(h) me(h) lau(h)da(h)re(h) te,(h) Vir(h)go(h) sa(h)cra(h)ta.(f.) <i>R.</i> (::)
Da(h) mi(h)hi(h) vir(h)tu(h)tem(h) con(h)tra(h) ho(h)stes(h) tu(h)os.(f.) (::)`,

  "ave-regina-prayer": `initial-style: 1;
%%
(c3)O(h)re(h)mus.(f) (::)
Con(h)ce(h)de,(h) mi(h)se(h)ri(h)cors(h) De(h)us,(h) fra(h)gi(h)li(h)ta(h)ti(h) no(h)strae(h) prae(h)si(h)di(f)um(f) (;) ut,(h) qui(h) san(h)ctae(h) De(h)i(h) Ge(h)ne(h)tri(h)cis(h) me(h)mo(h)ri(g)am(f) a(h)gi(h)mus;(h) (:) in(h)ter(h)ces(h)si(h)o(h)nis(h) e(h)jus(h) au(h)xi(h)li(h)o,(h) a(h) no(h)stris(h) i(h)ni(h)qui(h)ta(h)ti(h)bus(h) re(h)sur(h)ga(h)mus.(f) (:) Per(h) e(h)un(h)dem(h) Chri(h)stum(h) Do(h)mi(h)num(h) no(h)strum.(f.) <i>R.</i> (::)
A(g.)men.(h.) (::)`,

  // Regina Caeli Laetare (Easter → Trinity Sunday)
  "regina-caeli-laetare": `name: Regina caeli (simple tone);
mode: 6;
initial-style: 0;
%%
(c4) Re(f)gí(g)na(f) cae(g)li(h.) <i>*</i>() lae(ixi)tá(h)re,(g_[oh:h]) al(ixi)le(h)lú(g)ia:(f.) (;) Qui(f)a(j_) quem(j) me(k)ru(j)í(ixi)sti(h) por(f)tá(g)re,(h_) al(ixi)le(h)lú(g)ia:(f.) (:) Re(j)sur(j)ré(k)xit,(j_) si(j)cut(f) di(g)xit,(f_) al(g)le(h)lú(ixi)ia:(j.) (;) O(j)ra(f) pro(g) no(ixi)bis(h) De(g)um,(f.) al(e)le(g)lú(gg)ia.(f.) (::)`,

  "regina-caeli-versicle": `initial-style: 1;
%%
(c3)Gau(h)de(h) et(h) læ(h)ta(h)re,(h) Vir(h)go(h) Ma(h)ri(h)a,(h) al(h)le(h)lu(h)ia.(f.)  <i>R.</i>  (::)
Qui(h)a(h) sur(h)re(h)xit(h) Do(h)mi(h)nus(h) ve(h)re,(h) al(h)le(h)lu(h)ia.(f.) (::)`,

  "regina-caeli-prayer": `initial-style: 1;
%%
(c3)O(h)re(h)mus.(f) (::)
De(h)us,(h) qui(h) per(h) re(h)sur(h)re(h)cti(h)o(h)nem(h) Fi(h)li(h)i(h) tu(h)i,(h) Do(h)mi(h)ni(h) no(h)stri(h) Ie(g)su(f) Chri(h)sti,(h) (;) mun(h)dum(h) lae(h)ti(h)fi(h)ca(h)re(h) di(h)gna(h)tus(f) es:(f) (:) prae(h)sta,(h) quae(h)su(h)mus;(h) ut,(h) per(h) e(h)ius(h) Ge(h)ne(h)tri(h)cem(h) Vir(h)gi(h)nem(h) Ma(h)ri(h)am,(h) per(h)pe(h)tu(h)ae(h) ca(h)pi(h)a(h)mus(h) gau(h)di(h)a(h) vi(h)tae.(f) (:) Per(h) e(h)un(h)dem(h) Chri(h)stum(h) Do(h)mi(h)num(h) no(h)strum.(f) <i>R.</i> (::)
A(g.)men.(h.) (::)`,

  // Salve Regina (Trinity Monday → Advent 1 Eve)
  "salve-regina": `name:Salve Regina (simple tone);
mode:5;
%%
(c4) SAl(c)ve,(e) Re(g)gí(h)na,(g.) *() ma(h)ter(j) mi(i)se(h)ri(g)cór(h)di(g)ae :(g.) (;) Vi(j)ta,(g) dul(h)cé(ff)do,(d.) (;) et(e) spes(f) no(g)stra,(e) sal(e[ll:1]d)ve.(c.) (::) Ad(g) te(h) cla(i)má(j)mus,(g.) (;) éx(h)su(i)les,(j) fí(i)li(h)i(g) He(h)vae.(g.) (::) Ad(j) te(g) sus(h)pi(f)rá(d)mus,(e_[oh:h]) (;) ge(e)mén(g)tes(h) et(j) flen(h)tes(g_[oh:h]) (;) in(h) hac(g) la(f)cri(e)má(d)rum(e) val(d)le.(c.) (::) E(g){ia}(h) er(i)go,(j_) Ad(g)vo(h)cá(j)ta(i) no(h)stra,(g.) (;) il(j)los(g) tu(h)os(f_) mi(d)se(e)ri(f)cór(g)des(f) ó(h)cu(g)los(g_[oh:h]) (,) ad(f) nos(e) con(d)vér(e[ll:1]d)te.(c.) (::) Et(g) Je(hi)sum,(jj) be(i)ne(g)dí(h)ctum(g) fru(g)ctum(h) ven(j)tris(i) tu(h)i,(g.) (;) no(c)bis(g_[oh:h]) post(h) hoc(j) ex(i)sí(h)li(g)um(e_[oh:h]) os(f)tén(e[ll:1]d)de.(c.) (::) O(e!fwg) cle(ee)mens :(c.) (::) O(g!hwi/ji) pi(hg)a :(g.) (::) O(jjj//ghffd) dul(ef)cis(g_[oh:h]) *(;) Vir(c)go(f) Ma(e)rí(dc)a.(c.) (::)`,

  "salve-regina-versicle": `initial-style: 1;
%%
(c3)O(h)ra(h) pro(h) no(h)bis,(h) san(h)cta(h) De(h)i(h) ge(h)ni(h)trix.(f)  <i>R.</i>  (::)
Ut(h) di(h)gni(h) ef(h)fi(h)ci(h)a(h)mur(h) pro(h)mis(h)si(h)o(h)ni(h)bus(h) Chri(h)sti.(f) (::)`,

  "salve-regina-prayer": `initial-style: 1;
%%
(c3)O(h)re(h)mus.(f) (::)
Om(h)ni(h)po(h)tens(h) sem(h)pi(h)ter(h)ne(h) De(h)us,(f) (,) qui(h) glo(h)ri(h)o(h)sæ(h) Vir(h)gi(h)nis(h) Ma(h)tris(h) Ma(h)ri(h)æ(h) cor(h)pus(h) et(h) a(h)ni(h)mam,(h) ut(h) di(h)gnum(h) Fi(h)li(h)i(h) tu(h)i(h) ha(h)bi(h)ta(h)cu(h)lum(h) ef(h)fi(h)ci(h) me(h)re(g)re(f)tur,(h) (;) Spi(h)ri(h)tu(h) San(h)cto(h) co(h)o(h)pe(h)ran(h)te,(h) præ(h)pa(h)ra(h)sti:(f) (:) da,(h) ut(h) cu(h)ius(h) com(h)me(h)mo(h)ra(h)ti(h)o(h)ne(h) læ(h)ta(h)mur;(h) e(h)ius(h) pi(h)a(h) in(h)ter(h)ces(h)si(h)o(h)ne,(h) ab(h) in(h)stan(h)ti(h)bus(h) ma(h)lis,(h) et(h) a(h) mor(h)te(h) per(h)pe(h)tu(h)a(h) li(h)be(h)re(h)mur.(f) (:) Per(h) e(h)un(h)dem(h) Chri(h)stum(h) Do(h)mi(h)num(h) no(h)strum.(f) <i>R.</i> (::)
A(g.)men.(h.) (::)`,
};
